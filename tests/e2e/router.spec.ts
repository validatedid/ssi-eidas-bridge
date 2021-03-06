import request from "supertest";
import http from "http";
import fs from "fs";
import path from "path";
import { startService } from "../../src/api/app";
import { BRIDGE_SERVICE } from "../../src/config";
import { SignPayload } from "../../src/dtos/secureEnclave";
import * as mockedData from "../data/credentials";
import { EidasKeysInput } from "../../src/dtos/redis";
import { generateDid, ValidationResponse } from "../utils";
import redis from "../../src/libs/storage/redis";

jest.setTimeout(100000);

describe("eidas router API calls", () => {
  let server: http.Server;
  const testPort = 9901;

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

  afterAll(async () => {
    if (server) {
      server.close();
    }
    await redis.quit();
  });

  it("responds 404 to /", async () => {
    expect.assertions(1);
    const res = await request(server).get("/");
    expect(res.status).toStrictEqual(404);
  });

  const did = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";

  describe("store keys", () => {
    const testFilePathSelfSigned = "../data/fnmt/";
    const p12File = "sello_entidad.p12";
    const fileDataHex = fs.readFileSync(
      path.join(__dirname, `${testFilePathSelfSigned}${p12File}`),
      "hex"
    );
    const opts: EidasKeysInput = {
      did,
      eidasQec: fileDataHex,
    };
    it("returns a 201 for first key insertion", async () => {
      const randomOpts: EidasKeysInput = {
        did: await generateDid(),
        eidasQec: fileDataHex,
      };
      expect.assertions(1);
      const res = await request(server)
        .put(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}/${randomOpts.did}`
        )
        .send(randomOpts);
      expect(res.status).toStrictEqual(201);
    });
    it("returns a 200 for subsequent key insertion", async () => {
      expect.assertions(1);
      await request(server)
        .put(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}/${did}`
        )
        .send(opts);
      const res = await request(server)
        .put(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}/${did}`
        )
        .send(opts);
      expect(res.status).toStrictEqual(200);
    });
  });

  describe("secure enclave endpoints", () => {
    const password = "1234";
    it("returns a 400 without a body", async () => {
      expect.assertions(1);
      const res = await request(server).post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
      );
      expect(res.status).toStrictEqual(400);
    });

    it("returns a 201 with a signature", async () => {
      expect.assertions(2);
      const signPayload: SignPayload = {
        issuer: did,
        payload: mockedData.mockCredential,
        password,
      };
      const res = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .send(signPayload);
      expect(res.status).toStrictEqual(201);
      expect(res.body).toBeDefined();
    });

    it("returns a 204 with a valid signature", async () => {
      expect.assertions(3);
      const signPayload: SignPayload = {
        issuer: did,
        payload: mockedData.mockCredential,
        password,
      };
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
    });

    it("returns 204 with a signature from off-blocks signed credential", async () => {
      const resSigValidation = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
        )
        .send(mockedData.offblocksVerifiableCredential);
      expect(resSigValidation.status).toStrictEqual(200);
      expect(
        (resSigValidation.body as ValidationResponse).indication
      ).toStrictEqual("TOTAL_PASSED");
    });
  });
});
