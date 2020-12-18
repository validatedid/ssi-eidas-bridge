import { JWK, JWKECKey, JWT } from "jose";
import moment from "moment";
import { ethers } from "ethers";
import { ComponentSecureEnclave } from "../src/libs/secureEnclave";
import { API_PRIVATE_KEY, API_NAME } from "../src/config";
import { PRINT_DEBUG } from "../src/utils/util";
import { InternalError, ApiErrorMessages } from "../src/errors";
import { util } from "../src/utils";
import { LegalEntityAuthNToken } from "../src/dtos/jwt";

const mockedEnterpriseUser = {
  name: "Test Legal Entity",
  data: {
    did: "did:vid:0xefb3F269Bb3a0aa5BB4Cd6E6629BAa66863d3a92",
    publickey: "0x04",
  },
};

const createAuthNToken = (targetApp: string): string => {
  const payload = {
    iss: API_NAME,
    aud: targetApp,
    iat: moment().unix(),
    exp: moment().add(15, "s").unix(),
  };
  const buffer = Buffer.from(JSON.stringify(payload));
  const se = ComponentSecureEnclave.Instance;

  const jwt = se.signJwt(se.enclaveDid, buffer);
  return jwt;
};

const testAuthNToken = (): {
  did: string;
  key: JWKECKey;
  token: string;
} => {
  const se = ComponentSecureEnclave.Instance;
  const { did, key } = se.init(API_PRIVATE_KEY);
  const token = createAuthNToken(API_NAME);
  return { did, key, token };
};

const testEntityAuthNToken = (
  enterpiseName?: string
): { jwt: string; jwk: JWK.ECKey; did: string } => {
  // generate a new keypair
  const jwk = JWK.generateSync("EC", "secp256k1", { use: "sig" });
  const privKeyString = Buffer.from(jwk.d, "base64").toString("hex");
  const wallet: ethers.Wallet = new ethers.Wallet(
    util.prefixWith0x(privKeyString)
  );
  const did = `did:vid:${wallet.address}`;

  const payload: LegalEntityAuthNToken = {
    iss: enterpiseName || mockedEnterpriseUser.name,
    aud: API_NAME,
    iat: moment().unix(),
    exp: moment().add(15, "s").unix(),
    nonce: "a nonce",
  };

  const jwt = JWT.sign(payload, jwk, {
    header: {
      alg: "ES256K",
      typ: "JWT",
    },
  });
  return { jwt, jwk, did };
};

const initSecureEnclave = (): string => {
  const { did } = ComponentSecureEnclave.Instance.init(API_PRIVATE_KEY);
  if (!did) throw new InternalError(ApiErrorMessages.ENCLAVE_DID_NULL);
  PRINT_DEBUG(`Secure Enclave initialized with DID:${did}`);

  return did;
};

export {
  testAuthNToken,
  initSecureEnclave,
  mockedEnterpriseUser,
  testEntityAuthNToken,
};
