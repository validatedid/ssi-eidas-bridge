import { Options, normalize } from "jsonld";
import { indication } from "../dtos";
import { VerifiableCredential } from "../dtos/eidas";
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

const isProof = (object: Record<string, unknown>): boolean => {
  return (
    "type" in object &&
    "created" in object &&
    "proofPurpose" in object &&
    "verificationMethod" in object
  );
};

const areProofs = (object: Record<string, unknown>): boolean => {
  if (!Array.isArray(object)) return isProof(object);
  return object.some((proof) => {
    return isProof(proof);
  });
};

const isVerifiableCredential = (object: Record<string, unknown>): boolean => {
  return (
    isCredential(object) &&
    "proof" in object &&
    areProofs(object.proof as VerifiableCredential)
  );
};

const canonizeCredential = async (
  payload: Record<string, unknown>
): Promise<string> => {
  if (!isCredential(payload))
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: ApiErrorMessages.CANONIZE_BAD_PARAMS,
    });
  const options: Options.Normalize = {
    algorithm: "URDNA2015",
    format: "application/n-quads",
  };

  return normalize(payload, options);
};

function pad(number: number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}

const toISOStringSeconds = (input: Date): string => {
  return `${input.getUTCFullYear()}-${pad(input.getUTCMonth() + 1)}-${pad(
    input.getUTCDate()
  )}T${pad(input.getUTCHours())}:${pad(input.getUTCMinutes())}:${pad(
    input.getUTCSeconds()
  )}Z`;
};

const parseSigningTime = (inputTime: string): string => {
  const year = Number(`20${inputTime.substr(0, 2)}`);
  const month = Number(inputTime.substr(2, 2)) - 1; // 0-11
  const day = Number(inputTime.substr(4, 2));
  const hour = Number(inputTime.substr(6, 2));
  const minutes = Number(inputTime.substr(8, 2));
  const seconds = Number(inputTime.substr(10, 2));
  return toISOStringSeconds(
    new Date(Date.UTC(year, month, day, hour, minutes, seconds, 0))
  );
};

export {
  getKidFromDidAndPemCertificate,
  KidInput,
  canonizeCredential,
  parseSigningTime,
  isVerifiableCredential,
};
