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
