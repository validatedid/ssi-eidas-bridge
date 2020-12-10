import Controller from "../../src/api/eidas/controller";
import { EidasKeysOptions } from "../../src/dtos/eidas";
import { generateTestKeys } from "../utils";
import constants from "../../src/@types";

describe("eidas keys tests should", () => {
  let sameDid: string;
  it("store a given key for the first time", async () => {
    expect.assertions(2);
    const { hexPrivateKey, did } = generateTestKeys(
      constants.KeyTypes.EC,
      constants.ECCurves.SECP256K1
    );
    const opts: EidasKeysOptions = {
      did,
      eidasKey: hexPrivateKey,
      keyType: constants.KeyTypes.EC,
      curveType: constants.ECCurves.SECP256K1,
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
    const { hexPrivateKey } = generateTestKeys(
      constants.KeyTypes.EC,
      constants.ECCurves.SECP256K1
    );
    const opts: EidasKeysOptions = {
      did: sameDid,
      eidasKey: hexPrivateKey,
      keyType: constants.KeyTypes.EC,
      curveType: constants.ECCurves.SECP256K1,
    };
    const response = await Controller.putEidasKeys(opts);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      eidasKey: hexPrivateKey,
      firstInsertion: false,
    });
  });
});
