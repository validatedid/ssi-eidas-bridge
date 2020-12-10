import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "@ceramicnetwork/key-did-resolver";
import { DID } from "dids";
import crypto from "crypto";
import { resolver } from "@transmute/did-key.js";
import { DIDDocument } from "did-resolver";
import { getPemPublicKeyfromPemCert } from "./crypto";
import { replacePemHeaderAndNewLines } from "./util";

interface KidInput {
  did: string;
  pemCertificate: string;
}

const getKidFromDidAndPemCertificate = (input: KidInput): string => {
  return `${input.did}#${replacePemHeaderAndNewLines(
    getPemPublicKeyfromPemCert(input.pemCertificate),
    "PUBLIC KEY"
  )}`;
};

const generateDid = async (inputSeed?: Uint8Array): Promise<string> => {
  let seed = inputSeed;
  if (!inputSeed) seed = crypto.randomBytes(32);
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  return did.id;
};

const resolveDid = async (did: string): Promise<DIDDocument> => {
  return (await resolver.resolve(did)) as DIDDocument;
};

export { getKidFromDidAndPemCertificate, KidInput, generateDid, resolveDid };
