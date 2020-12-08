import { JWK } from "jose";
import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { EnterpriseWallet } from "../../src/libs/secureEnclave";
import constants from "../../src/@types";

jest.mock("ioredis");

describe("enterprise wallet suite", () => {
  it("should return an did", () => {
    expect.assertions(1);
    const key = JWK.generateSync("EC", "secp256k1", { use: "sig" });
    expect(EnterpriseWallet.getDid(key)).toContain("did:vid");
  });

  it("should sign", async () => {
    expect.assertions(1);
    const payload = { data: "test sample data" };
    const buff = Buffer.from(JSON.stringify(payload));
    const token = await EnterpriseWallet.signDidJwt("did:vid:0x00", buff);
    expect(token).toBeDefined();
  });
});

describe("eidas enterprise wallet tests should", () => {
  const testFilePathWithCa = "../data/test2/";
  const testFilePathSelfSigned = "../data/test1/";
  const p12File = "keyStore.p12";
  it("throw an error when no data can be retrieved from redis", () => {
    expect.assertions(1);
    jest.spyOn(Redis.prototype, "get").mockImplementation(() => {
      return undefined;
    });
    expect(new EnterpriseWallet("did:key:zUepp", "password")).toThrow(
      "Internal Server Error"
    );
    jest.restoreAllMocks();
  });

  it("create a new enterpriseWallet", () => {
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
    const wallet = new EnterpriseWallet("did:key:zUepp", "vidchain");
    expect(wallet).toBeDefined();
    jest.restoreAllMocks();
  });
});
