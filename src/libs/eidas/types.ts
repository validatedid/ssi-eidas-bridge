export interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws?: string;
}
export interface EidasProof extends Proof {
  domain?: string;
  cades?: string;
}
