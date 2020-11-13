import { JWK, JWKECKey, JWT } from "jose";
import moment from "moment";
import { ethers } from "ethers";
import { ComponentSecureEnclave } from "../src/libs/secureEnclave";
import { API_PRIVATE_KEY, API_NAME } from "../src/config";
import {
  LegalEntityAuthNToken,
  IEnterpriseAuthZToken,
} from "../src/libs/secureEnclave/jwt";
import { PRINT_DEBUG } from "../src/utils/util";
import { InternalError, ApiErrorMessages } from "../src/errors";
import AuthManager from "../src/libs/authManager/authManager";
import util from "../src/utils";

const mockedEnterpriseUser = {
  name: "Test Legal Entity",
  data: {
    did: "did:vid:0xefb3F269Bb3a0aa5BB4Cd6E6629BAa66863d3a92",
    publickey: "0x04",
  },
};

async function createAuthNToken(targetApp: string): Promise<string> {
  const payload = {
    iss: API_NAME,
    aud: targetApp,
    iat: moment().unix(),
    exp: moment().add(15, "s").unix(),
  };
  const buffer = Buffer.from(JSON.stringify(payload));
  const se = ComponentSecureEnclave.Instance;

  const jwt = await se.signJwt(se.enclaveDid, buffer);
  return jwt;
}

const testAuthNToken = async (): Promise<{
  did: string;
  key: JWKECKey;
  token: string;
}> => {
  const se = ComponentSecureEnclave.Instance;
  const { did, key } = await se.init(API_PRIVATE_KEY);
  const token = await createAuthNToken(API_NAME);
  return { did, key, token };
};

const testEntityAuthNToken = async (
  enterpiseName?: string
): Promise<{ jwt: string; jwk: JWK.ECKey; did: string }> => {
  // generate a new keypair
  const jwk = JWK.generateSync("EC", "secp256k1", { use: "sig" });
  const privKeyString = Buffer.from(<string>jwk.d, "base64").toString("hex");
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

async function initSecureEnclave(): Promise<string> {
  const { did } = await ComponentSecureEnclave.Instance.init(API_PRIVATE_KEY);
  if (!did) throw new InternalError(ApiErrorMessages.ENCLAVE_DID_NULL);
  PRINT_DEBUG(`Secure Enclave initialized with DID:${did}`);

  return did;
}

async function getEnterpriseAuthZToken(
  enterpiseName?: string
): Promise<{
  jwt: string;
  did: string;
}> {
  const { did } = await testEntityAuthNToken(enterpiseName);
  const payload: IEnterpriseAuthZToken = {
    did,
    iss: API_NAME,
    aud: API_NAME,
    nonce: "a nonce",
  };
  // Create and sign JWT
  const jwt = await AuthManager.Instance.createAuthorizationToken(
    payload,
    payload.aud
  );
  return { jwt, did };
}

export {
  testAuthNToken,
  initSecureEnclave,
  mockedEnterpriseUser,
  testEntityAuthNToken,
  getEnterpriseAuthZToken,
};
