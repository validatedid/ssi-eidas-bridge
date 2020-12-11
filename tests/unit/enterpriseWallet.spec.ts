import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { EnterpriseWallet } from "../../src/libs/secureEnclave";
import constants from "../../src/@types";
import { ApiErrorMessages, InternalError } from "../../src/errors";
import { eidasCrypto } from "../../src/utils";
import * as mockedData from "../data/credentials";
import { verifyCadesSignature } from "../../src/libs/secureEnclave/cades";

jest.mock("ioredis");

describe("eidas enterprise wallet tests should", () => {
  const testFilePathWithCa = "../data/test2/";
  const testFilePathSelfSigned = "../data/test1/";
  const p12File = "keyStore.p12";
  const password = "vidchain";
  const mockDid = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";

  it("create a new enterpriseWallet", async () => {
    expect.assertions(1);
    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathWithCa}${p12File}`)
    );
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: fileData,
        keyType: constants.KeyTypes.RSA,
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

  it("throw InternalError when redis returns a EidasKeysData data without keytype", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: "some data",
      });
    });
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA);
    jest.restoreAllMocks();
  });

  it("throw InternalError when redis returns a EidasKeysData data with keytype = EC but not keyCurve", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: "some data",
        keyType: constants.KeyTypes.EC,
      });
    });
    await expect(
      EnterpriseWallet.createInstance({ did: mockDid, password } as never)
    ).rejects.toThrow(ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA);
    jest.restoreAllMocks();
  });

  it("throw InternalError when redis returns a EidasKeysData data with keytype = OKP but not keyCurve", async () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: "some data",
        keyType: constants.KeyTypes.OKP,
      });
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
        p12: "some data",
        keyType: constants.KeyTypes.RSA,
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
        p12: "some data",
        keyType: constants.KeyTypes.RSA,
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
        p12: "some data",
        keyType: constants.KeyTypes.RSA,
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
    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathWithCa}${p12File}`)
    );
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: fileData,
        keyType: constants.KeyTypes.RSA,
      });
    });
    const dataToSign = {
      data: "some data",
    };
    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });

    await expect(wallet.eSeal(dataToSign)).rejects.toThrow(
      ApiErrorMessages.CANONIZE_BAD_PARAMS
    );
    jest.restoreAllMocks();
  });

  it("seals a given payload with a certificate with CA", async () => {
    expect.assertions(1);
    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathWithCa}${p12File}`)
    );
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: fileData,
        keyType: constants.KeyTypes.RSA,
      });
    });

    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });

    const signature = await wallet.eSeal(mockedData.mockVC);
    expect(signature).toBeDefined();
    jest.restoreAllMocks();
  }, 40000);

  it("verifies a seal with a given payload with a certificate with CA", async () => {
    expect.assertions(2);
    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathWithCa}${p12File}`)
    );
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: fileData,
        keyType: constants.KeyTypes.RSA,
      });
    });

    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });

    const cadesOuput = await wallet.eSeal(mockedData.mockVC);
    const verificationOut = verifyCadesSignature(cadesOuput.cades);
    expect(verificationOut.isValid).toBe(true);
    expect(verificationOut.parse).toBeDefined();
    jest.restoreAllMocks();
  }, 40000);

  it("verifies a seal with a given payload with a selfsigned certificate", async () => {
    expect.assertions(2);
    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathSelfSigned}${p12File}`)
    );
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return JSON.stringify({
        p12: fileData,
        keyType: constants.KeyTypes.RSA,
      });
    });

    const wallet = await EnterpriseWallet.createInstance({
      did: mockDid,
      password,
    });

    const cadesOuput = await wallet.eSeal(mockedData.mockVC);
    const verificationOut = verifyCadesSignature(cadesOuput.cades);
    expect(verificationOut.isValid).toBe(true);
    expect(verificationOut.parse).toBeDefined();
    jest.restoreAllMocks();
  }, 40000);
});
