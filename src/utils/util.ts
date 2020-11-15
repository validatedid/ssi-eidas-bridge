import { JWK } from "jose";
import * as util from "util";
import { AxiosError } from "axios";
import { decodeJWT } from "did-jwt";
import LOGGER from "../logger";
import { ENVIRONMENT } from "../config";
import { ProblemDetailsError } from "../errors";

const toHex = (data: string): string =>
  Buffer.from(data, "base64").toString("hex");

const generateKeys = (): JWK.ECKey =>
  JWK.generateSync("EC", "secp256k1", { use: "sig" });

const prefixWith0x = (key: string): string =>
  key.startsWith("0x") ? key : `0x${key}`;

const PRINT = (data: any, level: string, operation?: string): void => {
  if (ENVIRONMENT === "test") {
    LOGGER.silent = true;
  }

  LOGGER.log({
    message: data,
    level,
    operation,
  });
};

const PRINT_INFO = (data: any, operation?: string): void => {
  PRINT(util.inspect(data), "info", operation);
};

const PRINT_DEBUG = (data: any, operation?: string): void => {
  PRINT(util.inspect(data), "debug", operation);
};

const PRINT_ERROR = (error: Error, operation?: string): void => {
  if (ENVIRONMENT === "test") {
    LOGGER.silent = true;
  }

  // check if it is an EBSI error
  if (error instanceof ProblemDetailsError) {
    LOGGER.error(error.title, "error", operation);
    LOGGER.error(error.status.toString(), "error", operation);
    LOGGER.error(error.detail || "", "error", operation);
  } else {
    LOGGER.error(error.message, "error", operation);
    LOGGER.error(error.name, "error", operation);
    if (error.stack) LOGGER.error(error.stack, "error", operation);
  }
  if ((error as AxiosError).response) {
    LOGGER.error(util.inspect((error as AxiosError).response!.data));
  }
};

const PRINT_SILLY = (data: any, operation?: string): void => {
  let toPrint = data;
  if (typeof toPrint !== "string") toPrint = util.inspect(data);
  PRINT(`\n${toPrint}`, "silly", operation);
};

const getIssuanceDate = (jwt: string): string => {
  const { payload } = decodeJWT(jwt);
  const iat = payload.iat ? payload.iat : new Date();
  const issuanceDate = new Date(iat).toISOString();
  return issuanceDate;
};

export {
  toHex,
  PRINT_INFO,
  PRINT_DEBUG,
  PRINT_ERROR,
  PRINT_SILLY,
  generateKeys,
  prefixWith0x,
  getIssuanceDate,
};
