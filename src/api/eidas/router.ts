import * as express from "express";
import cors from "cors";
import Controller from "./controller";
import { BRIDGE_SERVICE } from "../../config";
import LOGGER from "../../logger";
import { ApiErrorMessages, BadRequestError } from "../../errors";
import { indication } from "../../dtos";

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
      async (req: express.Request, res: express.Response) => {
        try {
          if (Object.keys(req.body).length === 0)
            throw new BadRequestError(indication.VERIFICATION_INDETERMINATE, {
              detail: ApiErrorMessages.BAD_REQUEST_MISSING_BODY,
            });
          await Controller.EIDASvalidateSignature(req.body);
          res.status(200).json({
            indication: indication.VERIFICATION_SUCCESS,
            checks: ["credential", "proof"],
            warnings: [],
            errors: [],
          });
        } catch (error) {
          LOGGER.error(`Error ${JSON.stringify(error)}`);
          if (
            (error as BadRequestError).title === indication.VERIFICATION_FAIL
          ) {
            res.status(200).json({
              indication: indication.VERIFICATION_FAIL,
              checks: ["credential", "proof"],
              warnings: [],
              errors: [JSON.stringify(error)],
            });
          }
          if (
            (error as BadRequestError).title ===
            indication.VERIFICATION_INDETERMINATE
          ) {
            res.status(400).json({
              indication: indication.VERIFICATION_INDETERMINATE,
              checks: ["credential", "proof"],
              warnings: [],
              errors: [JSON.stringify(error)],
            });
          }
        }
      }
    );

    router.put(
      `${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}`,
      cors(),
      (req: express.Request, res: express.Response) => {
        res.sendStatus(400);
      }
    );

    router.put(
      `${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}/:id`,
      cors(),
      async (req: express.Request, res: express.Response) => {
        const eidasQecId = req.params.id;
        try {
          const { id, firstInsertion } = await Controller.putEidasKeys(
            eidasQecId,
            req.body
          );
          res.status(firstInsertion ? 201 : 200).json({ id });
        } catch (error) {
          LOGGER.error(`Error ${JSON.stringify(error)}`);
          res.sendStatus(400);
        }
      }
    );
    router.options("*", cors());
    server.use(BRIDGE_SERVICE.BASE_PATH.EIDAS, router);
  }
}

export default Router;
