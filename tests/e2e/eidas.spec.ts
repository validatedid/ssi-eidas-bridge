import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { SignPayload } from "../../src/dtos/secureEnclave";
import { signEidas } from "../../src/libs/eidas/eidas";
import constants from "../../src/@types";
import * as mockedData from "../data/credentials";
import { verifyCadesSignature } from "../../src/libs/secureEnclave/cades";

jest.mock("ioredis");
describe("eidas tests", () => {
  const testFilePathSelfSigned = "../data/test1/";
  const p12File = "keyStore.p12";
  const password = "vidchain";
  const mockDid = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";
  it("should sign (mocking redis) and verify signature", async () => {
    expect.assertions(3);
    const fileDataHex = Buffer.from(
      fs.readFileSync(
        path.join(__dirname, `${testFilePathSelfSigned}${p12File}`)
      )
    ).toString("hex");
    const signPayload: SignPayload = {
      issuer: mockDid,
      payload: mockedData.mockVC,
      password,
    };
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
      });
    });
    const expectedProof = {
      type: constants.SignatureTypes.CAdESRSASignature2020,
      created: expect.any(String) as string,
      proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
      verificationMethod: expect.any(String) as string,
      cades: expect.any(String) as string,
    };
    const proof = await signEidas(signPayload);
    expect(proof).toMatchObject(expectedProof);
    const verificationOut = verifyCadesSignature(proof.cades);
    expect(verificationOut.isValid).toBe(true);
    expect(verificationOut.parse).toBeDefined();
    jest.restoreAllMocks();
  }, 30000);
});
