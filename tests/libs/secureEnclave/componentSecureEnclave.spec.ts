import { ComponentSecureEnclave } from "../../../src/libs/secureEnclave";
import { API_PRIVATE_KEY } from "../../../src/config";

describe("componentSecureEnclave test suite", () => {
  it("should throw InternalError with no encryptedKeystore", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    await expect(se.init(undefined as any)).rejects.toThrow(
      "Internal Server Error"
    );
  });

  it("should throw InternalError with no did: getPublicKey", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.getPublicKey("")).toThrow("Internal Server Error");
  });

  it("should throw InternalError with no did: exportPrivateKey", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.exportPrivateKey("")).toThrow("Internal Server Error");
  });

  it("should throw InternalError with no did: signJwt", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    await expect(se.signJwt("", {} as any)).rejects.toThrow(
      "Internal Server Error"
    );
  });

  it("should throw InternalError with no did: encrypt", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.encrypt("" as any)).toThrow("Internal Server Error");
  });

  it("should throw InternalError with no did: decrypt", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.decrypt("" as any)).toThrow("Internal Server Error");
  });

  it("should create a wallet and save it to DB if it does not exist", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = await se.init(API_PRIVATE_KEY);
    expect(did).toContain("did:vid");
  });

  it("should return public key", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = await se.init(API_PRIVATE_KEY);
    expect(se.getPublicKey(did)).toMatch(
      "0x042f28abb75ffd72766633057a57bdc71e687c38759c80d0547ff1383acf1c4f651ff91de55bd84288f9b7edff688c2aa87ab86819fa0c82234921184afab0d47d"
    );
  });

  it("should export encryptedKey", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = await se.init(API_PRIVATE_KEY);
    expect(se.exportPrivateKey(did)).toBeDefined();
  });

  it("should sign", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = await se.init(API_PRIVATE_KEY);
    const data = Buffer.from(JSON.stringify({ data: "some test data" }));
    const signature = await se.signJwt(did, data);
    expect(signature).toBeDefined();
  });

  it("should decrypt what is encrypted", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    await se.init(API_PRIVATE_KEY);
    const data = Buffer.from(JSON.stringify({ data: "some test data" }));
    expect(se.decrypt(se.encrypt(data))).toMatchObject(data);
  });
});
