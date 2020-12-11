import { JWK } from "jose";
import { ethers } from "ethers";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "@ceramicnetwork/key-did-resolver";
import crypto from "crypto";
import { resolver } from "@transmute/did-key.js";
import { DIDDocument } from "did-resolver";
import constants from "../src/@types";

const prefixWith0x = (key: string): string => {
  return key.startsWith("0x") ? key : `0x${key}`;
};

const generateTestKeys = (
  keyType: constants.KeyType,
  curveType: constants.Curves
): {
  hexPrivateKey: string;
  did: string;
  jwk: JWK.ECKey;
} => {
  let jwk: JWK.ECKey;
  let wallet: ethers.Wallet;
  let did: string;
  let hexPrivateKey: string;

  switch (keyType) {
    case "EC":
      switch (curveType) {
        case "secp256k1":
          jwk = JWK.generateSync(keyType, curveType, { use: "sig" });
          hexPrivateKey = Buffer.from(jwk.d, "base64").toString("hex");
          wallet = new ethers.Wallet(prefixWith0x(hexPrivateKey));
          did = `did:vid:${wallet.address}`;
          return { hexPrivateKey, did, jwk };
        default:
          throw new Error("secp256k1 only curveType supported");
      }
    default:
      throw new Error("EC only keyType supported");
  }
};

const generateDid = async (inputSeed?: Uint8Array): Promise<string> => {
  let seed = inputSeed;
  if (!inputSeed) seed = crypto.randomBytes(32);
  const provider = new Ed25519Provider(seed);

  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  return did.id;

  return "did:key:test";
};

const resolveDid = async (did: string): Promise<DIDDocument> => {
  return (await resolver.resolve(did)) as DIDDocument;
};

export { generateTestKeys, generateDid, resolveDid };
