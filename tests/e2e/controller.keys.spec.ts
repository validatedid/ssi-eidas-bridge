import fs from "fs";
import path from "path";
import Controller from "../../src/api/eidas/controller";
import { generateDid } from "../utils";
import constants from "../../src/@types";
import { EidasKeysData } from "../../src/dtos/redis";

describe("eidas keys tests should", () => {
  let sameDid = "";
  const testFilePathSelfSigned = "../data/test1/";
  const p12File = "keyStore.p12";
  const fileDataHex = Buffer.from(
    fs.readFileSync(path.join(__dirname, `${testFilePathSelfSigned}${p12File}`))
  ).toString("hex");

  it("store a given key for the first time", async () => {
    const did = await generateDid();
    sameDid = did;
    const opts: EidasKeysData = {
      did,
      p12: fileDataHex,
      keyType: constants.KeyTypes.RSA,
    };
    expect.assertions(2);
    const response = await Controller.putEidasKeys(opts);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      eidasKeysData: opts,
      firstInsertion: true,
    });
  });
  it("update key for same did", async () => {
    const opts: EidasKeysData = {
      did: sameDid,
      p12: fileDataHex,
      keyType: constants.KeyTypes.RSA,
    };
    expect.assertions(2);
    const response = await Controller.putEidasKeys(opts);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      eidasKeysData: opts,
      firstInsertion: false,
    });
  });
});
