import request from "supertest";
import http from "http";
import fs from "fs";
import path from "path";
import { startService } from "../../src/api/app";
import { BRIDGE_SERVICE } from "../../src/config";
import { SignPayload } from "../../src/dtos/secureEnclave";
import constants from "../../src/@types";
import * as mockedData from "../data/credentials";
import { EIDASSignatureOutput } from "../../src/dtos/eidas";
import { EidasKeysData } from "../../src/dtos/redis";
import { generateDid } from "../utils";
import redis from "../../src/libs/storage/redis";

jest.setTimeout(100000);

describe("eidas e2e flow", () => {
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

  it("stores keys, signs and verifies", async () => {
    expect.assertions(4);
    const did = await generateDid();
    const testFilePathSelfSigned = "../data/test1/";
    const p12File = "keyStore.p12";
    const fileDataHex = Buffer.from(
      fs.readFileSync(
        path.join(__dirname, `${testFilePathSelfSigned}${p12File}`)
      )
    ).toString("hex");
    const opts: EidasKeysData = {
      did,
      p12: fileDataHex,
      keyType: constants.KeyTypes.RSA,
    };
    const storeKeysResponse = await request(server)
      .put(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}/${did}`
      )
      .send(opts);
    expect(storeKeysResponse.status).toStrictEqual(201);
    const signPayload: SignPayload = {
      issuer: did,
      payload: mockedData.mockCredential,
      type: constants.SignatureTypes.CAdESRSASignature2020,
      password: "vidchain",
    };
    const signResponse = await request(server)
      .post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
      )
      .send(signPayload);
    expect(signResponse.status).toStrictEqual(201);
    expect(signResponse.body).toBeDefined();
    const sigValidationResponse = await request(server)
      .post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
      )
      .send((signResponse.body as EIDASSignatureOutput).vc);
    expect(sigValidationResponse.status).toStrictEqual(204);
  });
});
