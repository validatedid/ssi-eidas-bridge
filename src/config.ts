// CONFIG PROJECT FILE
import * as dotenv from "dotenv";
// importing .env variables
dotenv.config();

const LOCALHOST = "http://localhost";
const OPENAPI_PATH = "../../api/openapi.yaml";
const API_VERSION = "v1";

const checkStrVar = (variable: string | undefined, name: string): string => {
  if (!variable) throw new Error(`undefined variable: ${name}`);
  return variable;
};

interface EnvironmentOptions {
  logLevel: string;
  [x: string]: string;
}

interface EnvironmentType {
  production: EnvironmentOptions;
  staging: EnvironmentOptions;
  development: EnvironmentOptions;
  local: EnvironmentOptions;
  [x: string]: EnvironmentOptions;
}

const GLOBAL_CONFIG: EnvironmentType = {
  production: {
    logLevel: "info",
  },
  staging: {
    logLevel: "info",
  },
  development: {
    logLevel: "debug",
  },
  local: {
    logLevel: process.env.DEBUG_LEVEL ? process.env.DEBUG_LEVEL : "silly",
    bridgeApiBaseUrl: LOCALHOST,
  },
};

const ENVIRONMENT =
  process.env.BRIDGE_ENV === "production" ||
  process.env.BRIDGE_ENV === "staging" ||
  process.env.BRIDGE_ENV === "development" ||
  process.env.BRIDGE_ENV === "local"
    ? process.env.BRIDGE_ENV
    : "local";

const FINAL_CONFIG = GLOBAL_CONFIG[ENVIRONMENT];
const LOG_LEVEL = FINAL_CONFIG.logLevel;

const BRIDGE_EXTERNAL_API_BASE_URL = FINAL_CONFIG.bridgeApiBaseUrl
  ? FINAL_CONFIG.bridgeApiBaseUrl
  : checkStrVar(process.env.BRIDGE_API_EXTERNAL_URL, "BRIDGE_API_EXTERNAL_URL");

const BRIDGE_BASE_PATH = {
  API_DOCS: "/api-docs",
  DID: `/did/${API_VERSION}`,
  LEDGER: `/ledger/${API_VERSION}`,
  WALLET: `/wallet/${API_VERSION}`,
  IDHUB: `/identity-hub/${API_VERSION}`,
  EIDAS: `/eidas-bridge/${API_VERSION}`,
  BESU: `/ledger/${API_VERSION}/blockchains/besu`,
  TRUSTED_APPS_REGISTRY: `/trusted-apps-registry/${API_VERSION}`,
};

const BRIDGE_SERVICE_NAME = {
  DID: "DID API",
  BESU: "BESU API",
  LEDGER: "LEDGER API",
  WALLET: "WALLET API",
  API_DOCS: "API DOCS",
  STORAGE: "STORAGE API",
  IDHUB: "IDENTITY HUB API",
  EIDAS: "EIDAS BRIDGE API",
  TRUSTED_APPS_REGISTRY: "TRUSTED_APPS_REGISTRY API",
};

const BRIDGE_SERVICE_BASE_URL = {
  EIDAS: LOCALHOST,
  DID: BRIDGE_EXTERNAL_API_BASE_URL,
  BESU: BRIDGE_EXTERNAL_API_BASE_URL,
  IDHUB: BRIDGE_EXTERNAL_API_BASE_URL,
  LEDGER: BRIDGE_EXTERNAL_API_BASE_URL,
  WALLET: BRIDGE_EXTERNAL_API_BASE_URL,
  API_DOCS: BRIDGE_EXTERNAL_API_BASE_URL,
  TRUSTED_APPS_REGISTRY: BRIDGE_EXTERNAL_API_BASE_URL,
};

const BRIDGE_SERVICE_PORT = {
  EIDAS: process.env.EIDAS_PORT ? +process.env.EIDAS_PORT : 9002,
};

const BRIDGE_SERVICE_SWAGGER = {
  EIDAS: BRIDGE_BASE_PATH.EIDAS + BRIDGE_BASE_PATH.API_DOCS,
};

const BRIDGE_SERVICE_CALL = {
  API_DOCS: "/api-docs",
  BRIDGE_LOGIN: "/sessions",
  SIGNATURE_CREATION: "/signatures",
  SIGNATURE_VALIDATION: "/signature-validations",
  ADD_EIDAS_KEY: "/eidas-keys",
};

const BRIDGE_SERVICE_URL = {
  DID: `${BRIDGE_SERVICE_BASE_URL.DID}${BRIDGE_BASE_PATH.DID}`,
  BESU: `${BRIDGE_SERVICE_BASE_URL.BESU}${BRIDGE_BASE_PATH.BESU}`,
  EIDAS: `${BRIDGE_SERVICE_BASE_URL.EIDAS}:${BRIDGE_SERVICE_PORT.EIDAS}${BRIDGE_BASE_PATH.EIDAS}`,
  IDHUB: `${BRIDGE_SERVICE_BASE_URL.IDHUB}${BRIDGE_BASE_PATH.IDHUB}`,
  LEDGER: `${BRIDGE_SERVICE_BASE_URL.LEDGER}${BRIDGE_BASE_PATH.LEDGER}`,
  WALLET: `${BRIDGE_SERVICE_BASE_URL.WALLET}${BRIDGE_BASE_PATH.WALLET}`,
  API_DOCS: `${BRIDGE_SERVICE_BASE_URL.API_DOCS}${BRIDGE_BASE_PATH.API_DOCS}`,
  TRUSTED_APPS_REGISTRY: `${BRIDGE_SERVICE_BASE_URL.TRUSTED_APPS_REGISTRY}${BRIDGE_BASE_PATH.TRUSTED_APPS_REGISTRY}`,
};

const BRIDGE_SERVICE_SWAGGER_FULL_URL = {
  EIDAS: BRIDGE_SERVICE_URL.EIDAS + BRIDGE_BASE_PATH.API_DOCS,
};

const BRIDGE_SERVICE_EXTERNAL_SWAGGER_FULL_URL = {
  EIDAS:
    BRIDGE_EXTERNAL_API_BASE_URL +
    BRIDGE_BASE_PATH.EIDAS +
    BRIDGE_BASE_PATH.API_DOCS,
};

const BRIDGE_SERVICE = {
  NAME: BRIDGE_SERVICE_NAME,
  BASE_URL: BRIDGE_SERVICE_BASE_URL,
  PORT: BRIDGE_SERVICE_PORT,
  SWAGGER: BRIDGE_SERVICE_SWAGGER,
  CALL: BRIDGE_SERVICE_CALL,
  URL: BRIDGE_SERVICE_URL,
  BASE_PATH: BRIDGE_BASE_PATH,
  SWAGGER_INTERNAL_URL: BRIDGE_SERVICE_SWAGGER_FULL_URL,
  SWAGGER_EXTERNAL_URL: BRIDGE_SERVICE_EXTERNAL_SWAGGER_FULL_URL,
};

const API_NAME = "ssi-eidas-bridge";
const WALLET = "vidchain-api";
const BRIDGE_DID_IDENTIFIERS = `${BRIDGE_SERVICE.URL.DID}/identifiers`;
const throwError = (varName: string) => {
  throw new Error(`${varName} not provided as ENV variable`);
};
const API_PRIVATE_KEY = process.env.API_PRIVATE_KEY
  ? process.env.API_PRIVATE_KEY
  : throwError("API_PRIVATE_KEY");

const LEDGER = {
  provider: checkStrVar(
    process.env.DID_PROVIDER_RPC_URL,
    "DID_PROVIDER_RPC_URL"
  ),
  didRegistry: checkStrVar(
    process.env.DID_REGISTRY_SC_ADDRESS,
    "DID_REGISTRY_SC_ADDRESS"
  ),
};

const REDIS = {
  PORT: process.env.REDIS_PORT,
  URL: process.env.REDIS_URL,
};

const DSS_REST_SERVICES = `/services/rest`;
const DSS_URL = {
  ORIGINAL_DOCUMENTS: `${checkStrVar(
    process.env.DSS_URL,
    "DSS_URL"
  )}${DSS_REST_SERVICES}/validation/getOriginalDocuments`,
  VALIDATE_SIGNATURE: `${checkStrVar(
    process.env.DSS_URL,
    "DSS_URL"
  )}${DSS_REST_SERVICES}/validation/validateSignature`,
};

export {
  API_NAME,
  LOG_LEVEL,
  ENVIRONMENT,
  BRIDGE_SERVICE,
  OPENAPI_PATH,
  API_PRIVATE_KEY,
  BRIDGE_DID_IDENTIFIERS,
  WALLET,
  LEDGER,
  REDIS,
  DSS_URL,
};
