import * as jsonld from "jsonld";
import { JsonLdObj } from "jsonld/jsonld-spec";
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

const canonizeVerifiableCredential = async (
  payload: Record<string, unknown>
): Promise<string> => {
  const doc = payload as JsonLdObj;
  const options: jsonld.Options.Normalize = {
    algorithm: "URDNA2015",
    format: "application/n-quads",
  };

  const canonized = await jsonld.normalize(doc, options);
  return canonized;
};

export {
  getKidFromDidAndPemCertificate,
  KidInput,
  canonizeVerifiableCredential,
};
