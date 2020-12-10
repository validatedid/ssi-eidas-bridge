import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { EnterpriseWallet } from "../../src/libs/secureEnclave";
import constants from "../../src/@types";

jest.mock("ioredis");

describe("eidas enterprise wallet tests should", () => {
  const testFilePathWithCa = "../data/test2/";
  const testFilePathSelfSigned = "../data/test1/";
  const p12File = "keyStore.p12";
  const password = "vidchain";
  const mockDid = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";

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
    const wallet = new EnterpriseWallet(mockDid, password);
    expect(wallet).toBeDefined();
    jest.restoreAllMocks();
  });
});
