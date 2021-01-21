import { Credential, VerifiableCredential } from "./eidas";

export interface SignPayload {
  issuer: string;
  payload: Credential | VerifiableCredential;
  password: string;
  expiresIn?: number; // in seconds
}
