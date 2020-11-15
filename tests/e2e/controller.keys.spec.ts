import Controller from "../../src/api/eidas/controller";
import { EidasKeysOptions } from "../../src/dtos/keys";
import generateTestKeys from "../utils";

describe("eidas keys tests should", () => {
  it("store a given secp256k1 private key", () => {
    expect.assertions(2);
    const { hexPrivateKey, did } = generateTestKeys("EC", "secp256k1");
    const opts: EidasKeysOptions = {
      did,
      eidasKey: hexPrivateKey,
      keyType: "EC",
      curveType: "secp256k1",
    };

    const response = Controller.putEidasKeys(opts);

    expect(response).toBeDefined();
    expect(response).toStrictEqual(hexPrivateKey);
  });
});
