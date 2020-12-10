import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import http from "http";
import net from "net";
import path from "path";
import YAML from "yamljs";
import * as bodyParser from "body-parser";
import EidasRouter from "./eidas/router";
import { PRINT_INFO, PRINT_ERROR } from "../utils/util";
import { BRIDGE_SERVICE, OPENAPI_PATH, API_PRIVATE_KEY } from "../config";
import {
  InternalError,
  ApiErrorMessages,
  ServiceUnavailableError,
  handleError,
} from "../errors";
import ComponentSecureEnclave from "../libs/secureEnclave/componentSecureEnclave";

class App {
  private connection!: http.Server;

  private router!: EidasRouter;

  public constructor(ebsiService: string, private httpServer = express()) {
    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer.use(bodyParser.json());
    this.httpServer.use(cors());
    this.httpServer.use((req, res, next) => {
      PRINT_INFO(`${req.method} ${req.url}`);
      next();
    });
    this.httpServer.use(handleError);
    const yamlFilePath = path.join(__dirname, OPENAPI_PATH);

    if (ebsiService !== BRIDGE_SERVICE.NAME.EIDAS)
      throw new ServiceUnavailableError(ServiceUnavailableError.defaultTitle, {
        detail: ApiErrorMessages.NO_BRIDGE_SERVICE_AVAILABLE,
      });

    this.router = new EidasRouter(this.httpServer);
    this.httpServer.use(
      BRIDGE_SERVICE.SWAGGER.EIDAS,
      swaggerUi.serve,
      swaggerUi.setup(YAML.load(yamlFilePath))
    );
  }

  public Start = async (port: number): Promise<http.Server> => {
    const { did } = ComponentSecureEnclave.Instance.init(API_PRIVATE_KEY);
    if (!did)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.ENCLAVE_DID_NULL,
      });
    PRINT_INFO(`Component Secure Enclave initialized with DID:${did}`);

    return new Promise((resolve, reject) => {
      this.connection = this.httpServer
        .listen(port, () => {
          resolve(this.connection);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };
}

export const startEbsiService = async (
  service: string,
  port: number,
  swaggerUrl: string
): Promise<http.Server> => {
  const app = new App(service);
  let server!: http.Server;
  try {
    server = await app.Start(port);
    PRINT_INFO(
      `Server ${service} running on port ${
        (server.address() as net.AddressInfo).port
      }, swagger available at: ${swaggerUrl}`
    );
  } catch (error) {
    PRINT_ERROR(error);
  }
  return server;
};

export default App;
