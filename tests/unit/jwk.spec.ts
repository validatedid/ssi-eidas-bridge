import { JWK } from "jose/types";
import getJWKfromHex from "../../src/utils/jwk";

describe("jWK test", () => {
  it("should generate a JWK from hex public and private", () => {
    expect.assertions(3);
    const expectedJWK: JWK = {
      crv: "secp256k1",
      x: "rIVa2go50gSs5pCDF5wY-fb5-TzTzyCWA9R8Ljuu5Xw",
      y: "89yC4d1PzbZArCq-YI17hzFV3ZDOMlj9G8ufRKBl8o8",
      d: "-FdUSp0Ql-JC_wsoen5ukPGc-XPv4jF_KkZ4c5ZkQg8",
      kty: "EC",
      kid: "G5m5Nlbi7FZXOMYG7g-gKB-UFvEAIU2PY3HT7HVmbBs",
    };

    const privateKey =
      "f857544a9d1097e242ff0b287a7e6e90f19cf973efe2317f2a4678739664420f";
    const publicKey =
      "ac855ada0a39d204ace69083179c18f9f6f9f93cd3cf209603d47c2e3baee57cf3dc82e1dd4fcdb640ac2abe608d7b873155dd90ce3258fd1bcb9f44a065f28f";

    const jwk = getJWKfromHex(publicKey, privateKey);

    expect(jwk.d).toBe(expectedJWK.d);
    expect(jwk.x).toBe(expectedJWK.x);
    expect(jwk.y).toBe(expectedJWK.y);
  });

  it("should generate a JWK from hex public", () => {
    expect.assertions(2);
    const expectedJWK: JWK = {
      crv: "secp256k1",
      x: "rIVa2go50gSs5pCDF5wY-fb5-TzTzyCWA9R8Ljuu5Xw",
      y: "89yC4d1PzbZArCq-YI17hzFV3ZDOMlj9G8ufRKBl8o8",
      kty: "EC",
      kid: "G5m5Nlbi7FZXOMYG7g-gKB-UFvEAIU2PY3HT7HVmbBs",
    };

    const publicKey =
      "ac855ada0a39d204ace69083179c18f9f6f9f93cd3cf209603d47c2e3baee57cf3dc82e1dd4fcdb640ac2abe608d7b873155dd90ce3258fd1bcb9f44a065f28f";

    const jwk = getJWKfromHex(publicKey);

    expect(jwk.x).toBe(expectedJWK.x);
    expect(jwk.y).toBe(expectedJWK.y);
  });
});
