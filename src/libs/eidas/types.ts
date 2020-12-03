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
