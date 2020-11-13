import {
  DEFAULT_EIDAS_PROOF_TYPE,
  DEFAULT_PROOF_PURPOSE,
  DEFAULT_EIDAS_VERIFICATION_METHOD,
} from "./constants";
import { Proof } from "./types";

const PROOF_REQUIRED_KEYS = [
  "type",
  "created",
  "proofPurpose",
  "verificationMethod",
  "jws",
];

export const compareCredentialKeys = (
  arr1: string[],
  arr2: string[]
): boolean => {
  if (!arr1 || !arr2) return false;
  if (arr1.length > arr2.length) return false;

  let result = true;
  arr1.forEach((e1) => {
    if (arr2.lastIndexOf(e1) === -1) {
      result = false;
    }
  });
  return result;
};

const validateEIDASProofType = (value: string): void => {
  if (value.length < 1 || !value.includes(DEFAULT_EIDAS_PROOF_TYPE)) {
    throw new TypeError(`Proof type is missing '${DEFAULT_EIDAS_PROOF_TYPE}'`);
  }
};

const validateProofPurpose = (value: string): void => {
  if (value.length < 1 || !value.includes(DEFAULT_PROOF_PURPOSE)) {
    throw new TypeError(`Proof Purpose is missing '${DEFAULT_PROOF_PURPOSE}'`);
  }
};

const validateEIDASVerificationMethod = (value: string): void => {
  if (value.length < 1 || !value.includes(DEFAULT_EIDAS_VERIFICATION_METHOD)) {
    throw new TypeError(
      `EIDAS Verification Method key is missing '${DEFAULT_EIDAS_VERIFICATION_METHOD}'`
    );
  }
};

const validateProofKeys = (value: Proof): void => {
  if (Object.keys(value).length === 0)
    throw new TypeError("Proof must not be empty");

  const arrKeys = Object.keys(value);
  if (!compareCredentialKeys(PROOF_REQUIRED_KEYS, arrKeys)) {
    throw new TypeError("Proof must have the minimum required attributes");
  }
};

const validateEIDASProofAttributes = (proof: Proof): void => {
  validateEIDASProofType(proof.type);
  validateProofPurpose(proof.proofPurpose);
  validateEIDASVerificationMethod(proof.verificationMethod);
  validateProofKeys(proof);
};

export default validateEIDASProofAttributes;
