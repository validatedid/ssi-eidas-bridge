import request from "supertest";
import http from "http";
import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { startService } from "../../src/api/app";
import { BRIDGE_SERVICE } from "../../src/config";
import { SignPayload } from "../../src/dtos/secureEnclave";
import * as mockedData from "../data/credentials";
import { ValidationResponse } from "../utils";

jest.setTimeout(100000);
jest.mock("ioredis");

describe("eidas router API calls (mocking redis)", () => {
  let server: http.Server;
  const testPort = 9900;

  // eslint-disable-next-line jest/no-done-callback
  beforeAll(async (done) => {
    // launch Server to test its RESTful API
    server = await startService(
      BRIDGE_SERVICE.NAME.EIDAS,
      testPort,
      BRIDGE_SERVICE.SWAGGER_INTERNAL_URL.EIDAS
    );

    done();
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  it("responds 404 to /", async () => {
    expect.assertions(1);
    const res = await request(server).get("/");
    expect(res.status).toStrictEqual(404);
  });

  describe("secure enclave endpoints", () => {
    const testFilePathSelfSigned = "../data/test1/";
    const p12File = "keyStore.p12";
    const password = "vidchain";
    const mockDid = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";

    it("returns a 400 without a body", async () => {
      expect.assertions(1);
      const res = await request(server).post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
      );
      expect(res.status).toStrictEqual(400);
    });
    it("returns a 201 with a signature", async () => {
      expect.assertions(2);
      const fileDataHex = Buffer.from(
        fs.readFileSync(
          path.join(__dirname, `${testFilePathSelfSigned}${p12File}`)
        )
      ).toString("hex");
      const signPayload: SignPayload = {
        issuer: mockDid,
        payload: mockedData.mockCredential,
        password,
      };
      jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
        return JSON.stringify({
          eidasQec: fileDataHex,
        });
      });
      const res = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .send(signPayload);
      expect(res.status).toStrictEqual(201);
      expect(res.body).toBeDefined();
      jest.restoreAllMocks();
    });

    it("returns a 200 with a valid signature", async () => {
      expect.assertions(2);
      const fileDataHex = Buffer.from(
        fs.readFileSync(
          path.join(__dirname, `${testFilePathSelfSigned}${p12File}`)
        )
      ).toString("hex");
      const signPayload: SignPayload = {
        issuer: mockDid,
        payload: mockedData.mockCredential,
        password,
      };
      jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
        return JSON.stringify({
          eidasQec: fileDataHex,
        });
      });
      const res = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .send(signPayload);
      expect(res.status).toStrictEqual(201);

      const resSigValidation = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
        )
        .send(res.body);
      expect(resSigValidation.status).toStrictEqual(200);
      expect(
        (resSigValidation.body as ValidationResponse).indication
      ).toStrictEqual("TOTAL_PASSED");
      jest.restoreAllMocks();
    });
  });
});
