import { Proof } from "../libs/eidas/types";

export interface EIDASSignatureOutput {
  issuer: string;
  proof: Proof;
}
