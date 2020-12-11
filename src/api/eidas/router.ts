import * as express from "express";
import cors from "cors";
import Controller from "./controller";
import { BRIDGE_SERVICE } from "../../config";

class Router {
  constructor(server: express.Express) {
    const router = express.Router();

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
          await Controller.EIDASvalidateSignature(req.body);
          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      }
    );

    router.put(
      `${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}`,
      cors(),
      async (req: express.Request, res: express.Response) => {
        const { eidasKey, firstInsertion } = await Controller.putEidasKeys(
          req.body
        );
        res.status(firstInsertion ? 201 : 200).json(eidasKey);
      }
    );
    router.options("*", cors());
    server.use(BRIDGE_SERVICE.BASE_PATH.EIDAS, router);
  }
}

export default Router;
