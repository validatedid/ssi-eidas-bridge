export interface CadesSignatureOutput {
  cades: string;
  verificationMethod: string;
}

export interface CadesSignatureInput {
  issuer?: string;
  data: string;
  hash: string;
  pemCert: string;
  pemPrivKey: string;
}
