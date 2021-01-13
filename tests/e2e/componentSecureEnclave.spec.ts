import { ComponentSecureEnclave } from "../../src/libs/secureEnclave";
import { API_PRIVATE_KEY } from "../../src/config";
import redis from "../../src/libs/storage/redis";

describe("componentSecureEnclave test suite", () => {
  afterAll(async () => {
    await redis.quit();
  });
  it("should throw InternalError with no encryptedKeystore", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.init(undefined as never)).toThrow("Internal Server Error");
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

  it("should throw InternalError with no did: signJwt", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.signJwt("", {} as never)).toThrow("Internal Server Error");
  });

  it("should throw InternalError with no did: encrypt", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.encrypt("" as never)).toThrow("Internal Server Error");
  });

  it("should throw InternalError with no did: decrypt", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;
    se.enclaveDid = "";

    expect(() => se.decrypt("" as never)).toThrow("Internal Server Error");
  });

  it("should create a wallet and save it to DB if it does not exist", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = se.init(API_PRIVATE_KEY);
    expect(did).toContain("did:vid");
  });

  it("should return public key", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = se.init(API_PRIVATE_KEY);
    expect(se.getPublicKey(did)).toMatch(
      "0x042f28abb75ffd72766633057a57bdc71e687c38759c80d0547ff1383acf1c4f651ff91de55bd84288f9b7edff688c2aa87ab86819fa0c82234921184afab0d47d"
    );
  });

  it("should export encryptedKey", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = se.init(API_PRIVATE_KEY);
    expect(se.exportPrivateKey(did)).toBeDefined();
  });

  it("should sign", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = se.init(API_PRIVATE_KEY);
    const data = Buffer.from(JSON.stringify({ data: "some test data" }));
    const signature = se.signJwt(did, data);
    expect(signature).toBeDefined();
  });

  it("should decrypt what is encrypted", () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    se.init(API_PRIVATE_KEY);
    const data = Buffer.from(JSON.stringify({ data: "some test data" }));
    expect(se.decrypt(se.encrypt(data))).toMatchObject(data);
  });
});
