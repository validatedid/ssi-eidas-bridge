import { Resolver, DIDDocument } from "did-resolver";

export interface VerifiedJwt {
  payload: any;
  doc?: DIDDocument;
  issuer?: string;
  signer?: object;
  jwt: string;
}

export interface JWTVerifyOptions {
  auth?: boolean;
  audience?: string;
  callbackUrl?: string;
  resolver: Resolver;
}

export interface JWTHeader {
  typ: "JWT";
  alg: string;
  jwk?: string;
  jku?: string;
  kid?: string;
}

export interface JWTClaims {
  // Registered Claim names
  iss?: string; // (Issuer) Claim
  sub?: string; // (Subject) Claim
  aud?: string; // (Audience) Claim
  exp?: number; // (Expiration Time) Claim. (Set it in string: 1 hour, 10 minutes)
  nbf?: number; // (Not Before) Claim
  iat?: number; // (Issued At) Claim
  jti?: string; // (JWT ID) Claim
}

export interface UserAuthNToken extends JWTClaims {
  iss: string; // DID of the User
  aud: string; // RP Application Name as registered in the Trusted Apps Registry.
  iat: number; // The date at a time when the Assertion Token was issued.
  exp: number; // Expiration time on or after which the token MUST NOT be accepted for processin
  ticket: string; // EU Login Ticket
  publicKey: string; // MUST be user's public key from which the `iss` DID is derived.
}

export interface LegalEntityAuthNToken extends JWTClaims {
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  nonce: string;
}

export interface ComponentAuthNToken extends JWTClaims {
  sub: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

export interface IComponentAuthZToken extends JWTClaims {
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}
export interface IUserAuthZToken extends JWTClaims {
  sub: string; // EU Login/ECAS Username that is obtained from the ECAS.
  iat?: number; // The date at a time when the Access Token was issued.
  exp?: number; // The date and time on or after which the token MUST NOT be accepted for processing. (expiry is 900s)
  aud?: string; // Name of the application,  as registered in the Trusted Apps Registry, to which the Access Token is intended for.
  did: string; // DID of the user as specified in the Access Token Request.
  userName: string; // EU Login/ECAS Name and Surname of the user.
}

export interface IEnterpriseAuthZToken extends JWTClaims {
  sub?: string;
  did: string;
  aud: string;
  nonce: string;
}

export enum GrantType {
  jwtBearer = "urn:ietf:params:oauth:grant-type:jwt-bearer",
}

export enum VidchainAccessTokenScope {
  USER = "vidchain profile user",
  ENTITY = "vidchain profile entity",
  COMPONENT = "vidchain profile component",
}

export interface AccessTokenRequestBody {
  grantType: GrantType.jwtBearer;
  assertion: string;
  scope?: VidchainAccessTokenScope;
}

export enum TokenType {
  bearer = "Bearer",
}

export interface AccessTokenResponseBody {
  accessToken: string;
  tokenType: TokenType.bearer;
  expiresIn: number; // 15 minutes
  issuedAt: number;
}

export enum SignatureTypes {
  EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019",
  EidasSeal2019 = "EidasSeal2019",
}
