import { Proof } from "../libs/eidas/types";

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
  issuer: string;
  issuanceDate: string;
  proof: Proof;
}
