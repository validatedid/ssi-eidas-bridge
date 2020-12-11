import { Options, normalize } from "jsonld";
import { ApiErrorMessages, BadRequestError } from "../errors";
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

const isCredential = (object: Record<string, unknown>): boolean => {
  return (
    "@context" in object &&
    "id" in object &&
    "type" in object &&
    "credentialSubject" in object &&
    "issuer" in object &&
    "issuanceDate" in object
  );
};

const canonizeCredential = async (
  payload: Record<string, unknown>
): Promise<string> => {
  if (!isCredential(payload))
    throw new BadRequestError(ApiErrorMessages.CANONIZE_BAD_PARAMS);
  const options: Options.Normalize = {
    algorithm: "URDNA2015",
    format: "application/n-quads",
  };

  return normalize(payload, options);
};

export { getKidFromDidAndPemCertificate, KidInput, canonizeCredential };
