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

export enum SignatureTypes {
  EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019",
  EidasSeal2019 = "EidasSeal2019",
  CAdESRSASignature2020 = "CAdESRSASignature2020", // default
}

export enum KeyTypes {
  RSA = "RSA",
  EC = "EC",
  OKP = "OKP",
}

export enum ECCurves {
  SECP256K1 = "secp256k1",
}

export enum OKPCurves {
  ED25519 = "Ed25519",
}

export type KeyType = KeyTypes.RSA | KeyTypes.EC | KeyTypes.OKP;
export type ECCurve = ECCurves.SECP256K1;
export type OKPCurve = OKPCurves.ED25519;
export type Curves = OKPCurve | ECCurve;

export enum SignKeyAlgorithm {
  ES256KR = "ES256K-R",
  ES256K = "ES256K",
  RS256 = "RS256", // default
  EDDSA = "EdDSA",
}

export const JWT_ALG = SignKeyAlgorithm.RS256;
export const DEFAULT_EIDAS_PROOF_TYPE = SignatureTypes.CAdESRSASignature2020;
export const DEFAULT_PROOF_PURPOSE = "assertionMethod";
export const DEFAULT_EIDAS_VERIFICATION_METHOD = "#eidasKey";
export const DEFAULT_CMS_HEADER = "PKCS7";
export const DEFAULT_DID_KEY_RSA_INIT = "zUepp";
