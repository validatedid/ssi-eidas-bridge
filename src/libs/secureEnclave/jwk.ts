import { JWK, JWKECKey } from "jose";
import base64url from "base64url";
import { Buffer } from "buffer";
import { API_NAME } from "../../config";

interface IJwk {
  crv: string;
  x: string;
  y: string;
  d?: string;
  kty: string;
  kid?: string;
}

const getJWKfromHex = (
  publicKeyHex: string,
  privateKeyHex: string
): JWK.ECKey => {
  const jwk = <IJwk>{
    crv: "secp256k1",
    kty: "EC",
    kid: API_NAME,
  };

  const cleanPublicKeyHex = publicKeyHex.replace("0x04", "");
  const cleanPrivateKeyHex = privateKeyHex.replace("0x", "");

  const buf = Buffer.from(cleanPrivateKeyHex, "hex");
  jwk.d = base64url(buf);

  const X = cleanPublicKeyHex.substr(0, 64);
  const bufX = Buffer.from(X, "hex");
  jwk.x = base64url(bufX);

  const Y = cleanPublicKeyHex.substr(64, 64);
  const bufY = Buffer.from(Y, "hex");
  jwk.y = base64url(bufY);

  const jwkEcKey = JWK.asKey(<JWKECKey>jwk);
  return jwkEcKey;
};

export default getJWKfromHex;
