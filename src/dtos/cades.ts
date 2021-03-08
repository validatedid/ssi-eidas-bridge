import { DssVerificationOutput } from "./dss";

export interface CadesSignatureOutput {
  cades: string;
  verificationMethod: string;
  signingTime: string;
}

export interface DerSigningTime {
  hT: string;
  hTLV: string;
  isModified: boolean;
  date: string;
  s: string;
  hV: string;
  params: Record<string, unknown>;
}

export interface CadesSignatureInput {
  issuer?: string;
  created: string;
  data: string;
  pemCert: string;
  pemPrivKey: string;
  oid?: string;
}

export interface CadesSignerInfo {
  idx: number;
  signerid_issuer1: string;
  signerid_serial1: string;
  hashalg: string;
  idxSignedAttrs: string;
  signedAttrIdxList: number[];
  saSigningTime: string;
  saMessageDigest: string;
  sigalg: string;
  sigval: string;
  verifyDetail: {
    validMessageDigest: boolean;
    validSignatureValue: boolean;
    validSignatureValue_isValid: boolean;
  };
  certkey_idx: number;
  signedattrshex: string;
  isValid: boolean;
}

export interface CadesParsed {
  cmsType?: string;
  econtent: string;
  certsIdx?: number;
  signerinfosIdx?: number;
  signerInfos?: CadesSignerInfo[];
  signerInfoIdxList?: number[];
}

export interface CadesVerificationOutput {
  isValid: boolean;
  parse?: CadesParsed;
  DssVerificationOutput?: DssVerificationOutput;
}
