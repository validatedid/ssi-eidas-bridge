export enum HashAlg {
  SHA1 = "sha1",
  SHA256 = "sha256",
  SHA512 = "sha512",
}

export enum HashAlgKeyType {
  SHA1_RSA = "SHA1withRSA",
  SHA256_RSA = "SHA256withRSA",
  SHA512_RSA = "SHA512withRSA",
}

export interface CadesSignatureOutput {
  cades: string;
  verificationMethod: string;
}

export interface CadesSignatureInput {
  issuer?: string;
  data: string;
  pemCert: string;
  pemPrivKey: string;
  oid?: string;
}

export interface CadesVerificationOutput {
  isValid: boolean;
  parse?: Record<string, unknown>;
}
