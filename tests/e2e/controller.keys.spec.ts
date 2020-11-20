import Controller from "../../src/api/eidas/controller";
import { EidasKeysOptions } from "../../src/dtos/keys";
import generateTestKeys from "../utils";

describe("eidas keys tests should", () => {
  let sameDid: string;
  it("store a given key for the first time", async () => {
    expect.assertions(2);
    const { hexPrivateKey, did } = generateTestKeys("EC", "secp256k1");
    const opts: EidasKeysOptions = {
      did,
      eidasKey: hexPrivateKey,
      keyType: "EC",
      curveType: "secp256k1",
    };
    sameDid = did;
    const response = await Controller.putEidasKeys(opts);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      eidasKey: hexPrivateKey,
      firstInsertion: true,
    });
  });
  it("update key for same did", async () => {
    expect.assertions(2);
    const { hexPrivateKey } = generateTestKeys("EC", "secp256k1");
    const opts: EidasKeysOptions = {
      did: sameDid,
      eidasKey: hexPrivateKey,
      keyType: "EC",
      curveType: "secp256k1",
    };
    const response = await Controller.putEidasKeys(opts);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      eidasKey: hexPrivateKey,
      firstInsertion: false,
    });
  });
});
