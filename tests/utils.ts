import crypto from "crypto";
import fromKeyLike from "jose/jwk/from_key_like";
import { JWK } from "jose/types";
import { ethers } from "ethers";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "@ceramicnetwork/key-did-resolver";
import { resolver } from "@transmute/did-key.js";
import { DIDDocument } from "did-resolver";
import constants from "../src/@types";

export interface ValidationResponse {
  indication: string;
  checks: string[];
  warnings: string[];
  errors: string[];
}

const prefixWith0x = (key: string): string => {
  return key.startsWith("0x") ? key : `0x${key}`;
};

const generateTestKeys = async (
  keyType: constants.KeyType,
  curveType: constants.Curves
): Promise<{
  hexPrivateKey: string;
  did: string;
  jwk: JWK;
}> => {
  if (keyType !== "EC") throw new Error("EC only keyType supported");
  if (curveType !== "secp256k1")
    throw new Error("secp256k1 only curveType supported");

  const { privateKey } = crypto.generateKeyPairSync("ec", {
    namedCurve: "secp256k1",
  });
  const jwk = await fromKeyLike(privateKey);
  const hexPrivateKey = Buffer.from(jwk.d, "base64").toString("hex");
  const wallet = new ethers.Wallet(prefixWith0x(hexPrivateKey));
  const did = `did:vid:${wallet.address}`;
  return { hexPrivateKey, did, jwk };
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
