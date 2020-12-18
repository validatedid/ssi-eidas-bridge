import fs from "fs";
import path from "path";
import axios from "axios";
import { BRIDGE_SERVICE } from "../../src/config";
import { SignPayload } from "../../src/dtos/secureEnclave";
import constants from "../../src/@types";
import * as mockedData from "../data/credentials";
import { EIDASSignatureOutput } from "../../src/dtos/eidas";
import { EidasKeysData } from "../../src/dtos/redis";
import { generateDid } from "../utils";

jest.setTimeout(100000);

describe("eidas e2e flow towards vidchain", () => {
  // DEV
  const server = "https://dev.vidchain.net";
  // PRO
  // const server = "https://api.vidchain.net";

  it("stores keys, signs and verifies", async () => {
    expect.assertions(4);
    const did = await generateDid();
    const testFilePathSelfSigned = "../data/test1/";
    const p12File = "keyStore.p12";
    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathSelfSigned}${p12File}`)
    );
    const opts: EidasKeysData = {
      did,
      p12: fileData,
      keyType: constants.KeyTypes.RSA,
    };
    const storeKeysResponse = await axios.put(
      `${server}${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.ADD_EIDAS_KEY}`,
      opts
    );
    expect(storeKeysResponse.status).toStrictEqual(201);
    const signPayload: SignPayload = {
      issuer: did,
      payload: mockedData.mockCredential,
      type: constants.SignatureTypes.CAdESRSASignature2020,
      password: "vidchain",
    };
    const signResponse = await axios.post(
      `${server}${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`,
      signPayload
    );
    expect(signResponse.status).toStrictEqual(201);
    expect(signResponse.data).toBeDefined();
    const sigValidationResponse = await axios.post(
      `${server}${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`,
      (signResponse.data as EIDASSignatureOutput).vc
    );
    expect(sigValidationResponse.status).toStrictEqual(204);
  });
});
