import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { EnterpriseWallet } from "../../src/libs/secureEnclave";
import {
  ApiErrorMessages,
  BadRequestError,
  InternalError,
} from "../../src/errors";
import { eidasCrypto } from "../../src/utils";
import * as mockedData from "../data/credentials";
import { verifyCadesSignature } from "../../src/libs/secureEnclave/cades";
import { indication } from "../../src/dtos";
import { calculateLdProofHashforVerification } from "../../src/utils/ssi";

jest.mock("ioredis");

describe("eidas enterprise wallet tests should", () => {
  const testFilePath = "../data/validatedid/";
  const p12File = "keyStore.p12";
  const password = "vidchain";
  const mockDid = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";

  it("create a new enterpriseWallet", async () => {
    expect.assertions(1);
    const fileDataHex = Buffer.from(
      fs.readFileSync(path.join(__dirname, `${testFilePath}${p12File}`))
    ).toString("hex");
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
        did: mockDid,
        eidasQecId: uuid(),
      });
    });
    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });
    expect(wallet).toBeInstanceOf(EnterpriseWallet);
    jest.restoreAllMocks();
  });

  it("throw BadRequestError when no options is passed", async () => {
    expect.assertions(1);
    await expect(
      EnterpriseWallet.createInstance(undefined as never)
    ).rejects.toThrow(ApiErrorMessages.WALLET_BUILDER_BAD_PARAMS);
  });
  it("throw BadRequestError when no options did is passed", async () => {
    expect.assertions(1);
    await expect(EnterpriseWallet.createInstance({} as never)).rejects.toThrow(
      ApiErrorMessages.WALLET_BUILDER_BAD_PARAMS
    );
  });
  it("throw BadRequestError when no options password is passed", async () => {
    expect.assertions(1);
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid } as never)
    ).rejects.toThrow(ApiErrorMessages.WALLET_BUILDER_BAD_PARAMS);
  });

  it("throw InternalError when redis fails retrieving data", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      throw new InternalError("Redis error");
    });
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(
      `${ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA} : Redis error`
    );
    jest.restoreAllMocks();
  });

  it("throw InternalError when redis does not return a JSON stringified data", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return "some bad data";
    });
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(`${ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA} : `);
    jest.restoreAllMocks();
  });

  it("throw InternalError when redis does not return a EidasKeysData data", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({});
    });
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA);
    jest.restoreAllMocks();
  });

  it("throw InternalError when parseP12File does not return data", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: "some data",
        did: mockDid,
        eidasQecId: uuid(),
      });
    });
    jest.spyOn(eidasCrypto, "parseP12File").mockReturnValue(undefined as never);
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(ApiErrorMessages.ERROR_PARSING_P12_DATA);
    jest.restoreAllMocks();
  });

  it("throw InternalError when parseP12File does not return pemCert", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: "some data",
        did: mockDid,
        eidasQecId: uuid(),
      });
    });
    jest.spyOn(eidasCrypto, "parseP12File").mockReturnValue({} as never);
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(ApiErrorMessages.ERROR_PARSING_P12_DATA);
    jest.restoreAllMocks();
  });

  it("throw InternalError when parseP12File does not return pemPrivateKey", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: "some data",
        did: mockDid,
        eidasQecId: uuid(),
      });
    });
    jest
      .spyOn(eidasCrypto, "parseP12File")
      .mockReturnValue({ pemCert: "some cert" } as never);
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(ApiErrorMessages.ERROR_PARSING_P12_DATA);
    jest.restoreAllMocks();
  });

  it("throws a BadRequestError when seals a given payload not a credential", async () => {
    expect.assertions(1);
    const fileDataHex = Buffer.from(
      fs.readFileSync(path.join(__dirname, `${testFilePath}${p12File}`))
    ).toString("hex");
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
      });
    });
    const dataToSign = {
      data: "some data",
      did: mockDid,
      eidasQecId: uuid(),
    };
    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });
    const expectedError = new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: ApiErrorMessages.CANONIZE_BAD_PARAMS,
    });
    await expect(
      wallet.eSeal(dataToSign, mockedData.proofOptionsCades)
    ).rejects.toThrow(expectedError);
    jest.restoreAllMocks();
  });

  it("seals a given payload with a certificate with CA", async () => {
    expect.assertions(1);
    const fileDataHex = Buffer.from(
      fs.readFileSync(path.join(__dirname, `${testFilePath}${p12File}`))
    ).toString("hex");
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
        did: mockDid,
        eidasQecId: uuid(),
      });
    });

    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });

    const signature = await wallet.eSeal(
      mockedData.mockVC,
      mockedData.proofOptionsCades
    );
    expect(signature).toBeDefined();
    jest.restoreAllMocks();
  }, 40000);

  it("verifies a seal with a given payload with a certificate with CA", async () => {
    expect.assertions(4);
    const fileDataHex = Buffer.from(
      fs.readFileSync(path.join(__dirname, `${testFilePath}${p12File}`))
    ).toString("hex");
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
        did: mockDid,
        eidasQecId: uuid(),
      });
    });

    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });

    const cadesOuput = await wallet.eSeal(
      mockedData.mockVC,
      mockedData.proofOptionsCades
    );
    const verificationOut = await verifyCadesSignature(cadesOuput.cades);
    const dataToBeSigned = await calculateLdProofHashforVerification(
      mockedData.mockVC,
      mockedData.proofOptionsCades
    );
    expect(
      verificationOut.DssVerificationOutput.DiagnosticData.Signature[0]
        .BasicSignature.SignatureValid
    ).toBe(true);
    expect(verificationOut.parse).toBeDefined();
    expect(verificationOut.parse.econtent).toBeDefined();
    expect(verificationOut.parse.econtent).toBe(
      dataToBeSigned.toString("base64")
    );
    jest.restoreAllMocks();
  }, 40000);

  it("verifies a seal with a given payload with a selfsigned certificate", async () => {
    expect.assertions(4);
    const fileDataHex = Buffer.from(
      fs.readFileSync(path.join(__dirname, `${testFilePath}${p12File}`))
    ).toString("hex");
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        eidasQec: fileDataHex,
        did: mockDid,
        eidasQecId: uuid(),
      });
    });

    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });

    const cadesOuput = await wallet.eSeal(
      mockedData.mockVC,
      mockedData.proofOptionsCades
    );
    const verificationOut = await verifyCadesSignature(cadesOuput.cades);
    const dataToBeSigned = await calculateLdProofHashforVerification(
      mockedData.mockVC,
      mockedData.proofOptionsCades
    );
    expect(
      verificationOut.DssVerificationOutput.DiagnosticData.Signature[0]
        .BasicSignature.SignatureValid
    ).toBe(true);
    expect(verificationOut.parse).toBeDefined();
    expect(verificationOut.parse.econtent).toBeDefined();
    expect(verificationOut.parse.econtent).toBe(
      dataToBeSigned.toString("base64")
    );
    jest.restoreAllMocks();
  }, 40000);
});
