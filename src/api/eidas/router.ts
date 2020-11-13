import * as express from "express";
import cors from "cors";
import Controller from "./controller";
import { BRIDGE_SERVICE } from "../../config";
import {
  BadRequestError,
  UnauthorizedError,
  ApiErrorMessages,
} from "../../errors";

class Router {
  constructor(server: express.Express, swaggerDoc: any) {
    const router = express.Router();
    router.get("/openapi.json", (req: express.Request, res: express.Response) =>
      res.send(swaggerDoc)
    );

    // sessions call managed by auth middleware
    router.post(BRIDGE_SERVICE.CALL.BRIDGE_LOGIN);

    router.post(
      `${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`,
      cors(),
      async (req: express.Request, res: express.Response, next) => {
        try {
          const result = await Controller.EIDASsignature(req.body);
          res.status(201).json(result);
        } catch (error) {
          next(error);
        }
      }
    );

    router.post(
      `${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`,
      cors(),
      async (req: express.Request, res: express.Response, next) => {
        try {
          if (!req.body.proof)
            throw new BadRequestError(BadRequestError.defaultTitle, {
              detail: ApiErrorMessages.BAD_CREDENTIAL_PARAMETERS,
            });
          const { proof } = req.body;
          await Controller.EIDASvalidateSignature(proof);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      }
    );

    router.options("*", cors());
    server.use(BRIDGE_SERVICE.BASE_PATH.EIDAS, router);
  }
}

export default Router;
