import { ComponentSecureEnclave } from "../../../src/libs/secureEnclave";
import { API_PRIVATE_KEY } from "../../../src/config";

jest.setTimeout(100000);

describe("when starting a secure enclave", () => {
  it("should return a Component Secure Enclave class from the interface", () => {
    expect.assertions(1);
    expect(ComponentSecureEnclave.Instance).toBeInstanceOf(
      ComponentSecureEnclave
    );
  });
});

describe("when initializing", () => {
  it("should create a wallet and save it to DB if it does not exist", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    const { did } = await se.init(API_PRIVATE_KEY);
    expect(did.length).toBeGreaterThan(0);
  });
});
