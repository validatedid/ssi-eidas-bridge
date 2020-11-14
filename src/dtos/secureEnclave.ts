import { Credential, VerifiableCredential } from "./eidas";

export interface SignPayload {
  issuer: string;
  payload: Credential | VerifiableCredential;
  type: string;
  expiresIn?: number; // in seconds
}
