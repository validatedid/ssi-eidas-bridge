export type KeyType = "RSA" | "EC" | "OKP";
export type ECCurve = "P-256" | "secp256k1" | "P-384" | "P-521";
export type OKPCurve = "Ed25519" | "Ed448" | "X25519" | "X448";
export type Curves = OKPCurve | ECCurve;

export enum SignKeyAlgorithm {
  ES256KR = "ES256K-R", // default
  ES256K = "ES256K",
  RS256 = "RS256",
  EDDSA = "EdDSA",
}

export interface EidasKeysOptions {
  did: string;
  eidasKey: string; // hexPrivateKey for secp256k1 or PEM RSA key
  keyType: KeyType;
  curveType?: Curves;
}
