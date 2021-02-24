import crypto from "crypto";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "@ceramicnetwork/key-did-resolver";

export interface ValidationResponse {
  indication: string;
  checks: string[];
  warnings: string[];
  errors: string[];
}

const generateDid = async (inputSeed?: Uint8Array): Promise<string> => {
  let seed = inputSeed;
  if (!inputSeed) seed = crypto.randomBytes(32);
  const provider = new Ed25519Provider(seed);

  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  return did.id;
};

export { generateDid };
