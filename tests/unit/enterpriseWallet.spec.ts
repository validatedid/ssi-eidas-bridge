import { JWK } from "jose";
import { EnterpriseWallet } from "../../src/libs/secureEnclave";

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
