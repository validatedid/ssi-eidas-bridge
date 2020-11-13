export interface SignPayload {
  issuer: string;
  payload: any;
  type: string;
  expiresIn?: number; // in seconds
}
