import fs from "fs";
import path from "path";
import Controller from "../../src/api/eidas/controller";
import { generateDid } from "../utils";
import { EidasKeysInput } from "../../src/dtos/redis";
import redis from "../../src/libs/storage/redis";

describe("eidas keys tests should", () => {
  afterAll(async () => {
    await redis.quit();
  });

  let sameDid = "";
  const testFilePathSelfSigned = "../data/validatedid/";
  const p12File = "testValidatedId.p12";
  const fileDataHex = fs.readFileSync(
    path.join(__dirname, `${testFilePathSelfSigned}${p12File}`),
    "hex"
  );

  it("store a given key for the first time", async () => {
    const did = await generateDid();
    sameDid = did;
    const opts: EidasKeysInput = {
      did,
      eidasQec: fileDataHex,
    };
    expect.assertions(2);
    const response = await Controller.putEidasKeys(did, opts);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      id: did,
      firstInsertion: true,
    });
  });
  it("update key for same did", async () => {
    const opts: EidasKeysInput = {
      did: sameDid,
      eidasQec: fileDataHex,
    };
    expect.assertions(2);
    const response = await Controller.putEidasKeys(sameDid, opts);
    expect(response).toBeDefined();
    expect(response).toStrictEqual({
      id: sameDid,
      firstInsertion: false,
    });
  });
});
