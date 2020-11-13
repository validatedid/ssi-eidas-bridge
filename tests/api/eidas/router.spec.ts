import request from "supertest";
import express from "express";
import http from "http";
import { startEbsiService } from "../../../src/api/app";
import { BRIDGE_SERVICE } from "../../../src/config";
import * as auth from "../../../src/middleware/auth";
import Controller from "../../../src/api/eidas/controller";

const GrantType = {
  jwtBearer: "urn:ietf:params:oauth:grant-type:jwt-bearer",
};

jest.setTimeout(100000);
jest.mock("../../../src/middleware/auth");

const mockcallNewSession = auth.callNewSession as jest.Mock;

describe("wallet router API calls", () => {
  let server: http.Server;
  const testPort: number = 9900;

  // eslint-disable-next-line jest/no-hooks
  beforeAll(async (done) => {
    // launch Server to test its RESTful API
    server = await startEbsiService(
      BRIDGE_SERVICE.NAME.EIDAS,
      testPort,
      BRIDGE_SERVICE.SWAGGER_INTERNAL_URL.EIDAS
    );

    done();
  });

  // eslint-disable-next-line jest/no-hooks
  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  it("responds 404 to /", async () => {
    expect.assertions(1);
    const res = await request(server).get("/");
    expect(res.status).toStrictEqual(404);
  });

  describe("/sessions", () => {
    it("responds 400 to /sessions with no payload", async () => {
      expect.assertions(1);
      mockcallNewSession.mockImplementation(
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          res.sendStatus(400);
          next();
        }
      );
      const res = await request(server).post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.BRIDGE_LOGIN}`
      );
      expect(res.status).toBe(400);
    });

    it("responds 200 to /openapi.json", async () => {
      expect.assertions(1);
      const res = await request(server).get(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}/openapi.json`
      );
      expect(res.status).toStrictEqual(200);
    });

    it("responds 200 to /sessions with a correct structured payload mocking auth library", async () => {
      expect.assertions(1);
      const payload = {
        grantType: GrantType.jwtBearer,
        assertion:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      };
      mockcallNewSession.mockImplementation(
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          res.sendStatus(200);
          next();
        }
      );
      const res = await request(server)
        .post(`${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.BRIDGE_LOGIN}`)
        .send(payload);
      expect(res.status).toBe(200);
    });
  });

  describe("signature calls", () => {
    it("returns a 201 on signature creation", async () => {
      expect.assertions(1);
      jest
        .spyOn(auth, "handleToken")
        .mockImplementation(async (req: any, res: any, next: any) => {
          Object.assign(req.params, { authenticated: true });
          next();
        });
      jest.spyOn(Controller, "EIDASsignature").mockImplementation(async () => {
        return {} as any;
      });
      const response = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .send({});
      expect(response.status).toStrictEqual(201);
      jest.resetAllMocks();
    });

    it("returns a 204 with a valid signature", async () => {
      expect.assertions(1);
      jest
        .spyOn(auth, "handleToken")
        .mockImplementation(async (req: any, res: any, next: any) => {
          Object.assign(req.params, { authenticated: true });
          next();
        });
      jest
        .spyOn(Controller, "EIDASvalidateSignature")
        .mockImplementation(async () => {
          return {} as any;
        });
      const signValidation = { proof: "some proof" };
      const response = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
        )
        .send(signValidation);
      expect(response.status).toStrictEqual(204);
      jest.resetAllMocks();
    });

    it("throws an error on creation with non authenticated user", async () => {
      expect.assertions(1);
      jest
        .spyOn(auth, "handleToken")
        .mockImplementation(async (req: any, res: any, next: any) => {
          Object.assign(req.params, { authenticated: false });
          next();
        });
      jest.spyOn(Controller, "EIDASsignature").mockImplementation(async () => {
        return {} as any;
      });
      const response = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .send({});
      expect(response.status).toStrictEqual(401);
      jest.resetAllMocks();
    });

    it("throws an error on verify with non authenticated user", async () => {
      expect.assertions(1);
      jest
        .spyOn(auth, "handleToken")
        .mockImplementation(async (req: any, res: any, next: any) => {
          Object.assign(req.params, { authenticated: false });
          next();
        });
      jest
        .spyOn(Controller, "EIDASvalidateSignature")
        .mockImplementation(async () => {
          return {} as any;
        });
      const response = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
        )
        .send({});
      expect(response.status).toStrictEqual(401);
      jest.resetAllMocks();
    });

    it("throws an error on verify without proof", async () => {
      expect.assertions(1);
      jest
        .spyOn(auth, "handleToken")
        .mockImplementation(async (req: any, res: any, next: any) => {
          Object.assign(req.params, { authenticated: true });
          next();
        });
      jest
        .spyOn(Controller, "EIDASvalidateSignature")
        .mockImplementation(async () => {
          return {} as any;
        });
      const response = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
        )
        .send({});
      expect(response.status).toStrictEqual(400);
      jest.resetAllMocks();
    });
  });
});
