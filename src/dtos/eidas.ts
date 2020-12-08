import { Curves, KeyType } from "../@types/constants";

export interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws?: string;
}
export interface EidasProof extends Proof {
  cades?: string;
  [x: string]: unknown;
}

export interface EIDASSignatureOutput {
  issuer: string;
  vc: VerifiableCredential;
}
export interface CredentialSubject {
  [x: string]: unknown;
}
export interface CredentialStatus {
  id: string;
  type: string;
}
export interface InputCredential {
  id: string;
  "@context"?: string[];
  type: string[];
  credentialSubject: CredentialSubject;
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialStatus?: CredentialStatus;
  [x: string]: unknown;
}
export interface Credential extends InputCredential {
  "@context": string[];
}
export interface VerifiableCredential extends Credential {
  proof: Proof | Proof[];
}

export interface EidasKeysOptions {
  did: string;
  eidasKey: string; // hexPrivateKey for secp256k1 or PEM RSA key
  keyType: KeyType;
  curveType?: Curves;
}
