import { Verify } from "crypto";
import { SignPayload } from "../../dtos/secureEnclave";
import { ApiErrorMessages, BadRequestError } from "../../errors";
import { EnterpriseWallet } from "../secureEnclave";
import {
  DEFAULT_EIDAS_PROOF_TYPE,
  DEFAULT_PROOF_PURPOSE,
} from "../../@types/constants";
import { EidasProof, Proof, Credential } from "../../dtos/eidas";
import {
  canonizeCredential,
  getKidFromDidAndPemCertificate,
} from "../../utils/ssi";
import { verifyCadesSignature } from "../secureEnclave/cades";
import constants from "../../@types";
import { indication } from "../../dtos";
import { CadesVerificationOutput } from "../../dtos/cades";

const PROOF_REQUIRED_KEYS = [
  "type",
  "created",
  "proofPurpose",
  "verificationMethod",
  "cades",
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
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: `Proof type is missing ${DEFAULT_EIDAS_PROOF_TYPE}`,
    });
  }
};

const validateProofPurpose = (value: string): void => {
  if (value.length < 1 || !value.includes(DEFAULT_PROOF_PURPOSE)) {
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: `Proof Purpose is missing ${DEFAULT_PROOF_PURPOSE}`,
    });
  }
};

const validateProofKeys = (value: Proof): void => {
  if (Object.keys(value).length === 0)
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: `Proof must not be empty`,
    });

  const arrKeys = Object.keys(value);
  if (!compareCredentialKeys(PROOF_REQUIRED_KEYS, arrKeys)) {
    throw new TypeError("Proof must have the minimum required attributes");
  }
};

const validateEIDASProofAttributes = (proof: EidasProof): void => {
  validateEIDASProofType(proof.type);
  validateProofPurpose(proof.proofPurpose);
  validateProofKeys(proof);
};

const signEidas = async (signPayload: SignPayload): Promise<EidasProof> => {
  if (
    !signPayload ||
    !signPayload.issuer ||
    !signPayload.payload ||
    !signPayload.password
  )
    throw new BadRequestError(ApiErrorMessages.SIGN_EIDAS_BAD_PARAMETERS);

  let payloadToSign = signPayload.payload;
  if (signPayload.payload.proof) {
    // removing proof
    payloadToSign = (({ proof, ...o }) => o)(signPayload.payload);
  }
  const wallet = await EnterpriseWallet.createInstance({
    did: signPayload.issuer,
    password: signPayload.password,
  });

  const cadesOuput = await wallet.eSeal(payloadToSign);
  return {
    type: constants.SignatureTypes.CAdESRSASignature2020,
    created: cadesOuput.signingTime,
    proofPurpose: DEFAULT_PROOF_PURPOSE,
    verificationMethod: getKidFromDidAndPemCertificate({
      did: signPayload.issuer,
      pemCertificate: cadesOuput.verificationMethod,
    }),
    cades: cadesOuput.cades,
  };
};

const isEidasProof = (proof: Proof | EidasProof): boolean => {
  return "cades" in proof;
};

const verifyEidas = async (
  credential: Credential,
  eidasProof: EidasProof
): Promise<void> => {
  validateEIDASProofAttributes(eidasProof);
  let verificationOut: CadesVerificationOutput;
  try {
    verificationOut = verifyCadesSignature(eidasProof.cades);
  } catch (error) {
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: ApiErrorMessages.ERROR_VERIFYING_SIGNATURE,
    });
  }
  if (!verificationOut || !verificationOut.isValid)
    throw new BadRequestError(indication.VERIFICATION_INDETERMINATE, {
      detail: ApiErrorMessages.INDETERMINATE,
    });
  // check that the data signed is the same as the Verifiable Credential payload
  const canonizedCredential = await canonizeCredential(credential);
  const signedData = Buffer.from(
    verificationOut.parse.econtent,
    "hex"
  ).toString("utf-8");
  if (canonizedCredential !== signedData)
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: ApiErrorMessages.CREDENTIAL_PAYLOAD_MISMATCH_SIGNED_DATA,
    });
};

export { validateEIDASProofAttributes, signEidas, verifyEidas, isEidasProof };
