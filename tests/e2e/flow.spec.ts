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
    expect.assertions(5);
    const did = await generateDid();
    const testFilePathSelfSigned = "../data/validatedid/";
    const p12File = "testValidatedId.p12";
    const fileDataHex = fs.readFileSync(
      path.join(__dirname, `${testFilePathSelfSigned}${p12File}`),
      "hex"
    );
    const opts: EidasKeysInput = {
      eidasQec: fileDataHex,
      did,
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
      password: "vidchain",
    };
    const signResponse = await request(server)
      .post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
      )
      .send(signPayload);
    expect(signResponse.status).toStrictEqual(201);
    expect(signResponse.body).toBeDefined();
    // console.warn(JSON.stringify(signResponse.body, null, 2));
    const sigValidationResponse = await request(server)
      .post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
      )
      .send(signResponse.body);
    expect(sigValidationResponse.status).toStrictEqual(200);
    expect(
      (sigValidationResponse.body as ValidationResponse).indication
    ).toStrictEqual("INDETERMINATE");
  });

  it("stores keys, signs and verifies using fnmt certificate with accent marks", async () => {
    expect.assertions(5);
    const did = await generateDid();
    const testFilePathSelfSigned = "../data/fnmt/";
    const p12File = "sello_entidad.p12";
    const fileDataHex = fs.readFileSync(
      path.join(__dirname, `${testFilePathSelfSigned}${p12File}`),
      "hex"
    );
    const opts: EidasKeysInput = {
      eidasQec: fileDataHex,
      did,
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
      password: "1234",
    };
    const signResponse = await request(server)
      .post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
      )
      .send(signPayload);
    expect(signResponse.status).toStrictEqual(201);
    expect(signResponse.body).toBeDefined();
    // console.warn(JSON.stringify(signResponse.body, null, 2));
    const sigValidationResponse = await request(server)
      .post(
        `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
      )
      .send(signResponse.body);
    expect(sigValidationResponse.status).toStrictEqual(200);
    expect(
      (sigValidationResponse.body as ValidationResponse).indication
    ).toStrictEqual("TOTAL_PASSED");
  });
});
