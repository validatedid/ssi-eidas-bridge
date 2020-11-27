import { CadesSignatureInput } from "../../src/dtos/cades";
import signCadesRsa from "../../src/libs/eidas/cades";

describe("cades tests should", () => {
  it("create a rsa key", async () => {
    expect.assertions(1);
    const inputCades: CadesSignatureInput = {
      issuer: "did:example:123456",
      data: Buffer.from(JSON.stringify({ data: "Odyssey rocks the world!" })),
    };
    const outputCades = signCadesRsa(inputCades);
    expect(outputCades).toBeDefined();
  });
});
