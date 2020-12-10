import { JWK } from "jose";
import * as util from "util";
import { AxiosError } from "axios";
import { decodeJWT } from "did-jwt";
import LOGGER from "../logger";
import { ENVIRONMENT } from "../config";
import { BadRequestError, ProblemDetailsError } from "../errors";

const toHex = (data: string): string =>
  Buffer.from(data, "base64").toString("hex");

const generateKeys = (): JWK.ECKey =>
  JWK.generateSync("EC", "secp256k1", { use: "sig" });

const prefixWith0x = (key: string): string =>
  key.startsWith("0x") ? key : `0x${key}`;

const PRINT = (data: unknown, level: string, operation?: string): void => {
  if (ENVIRONMENT === "test") {
    LOGGER.silent = true;
  }

  LOGGER.log({
    message: data as string,
    level,
    operation,
  });
};

const PRINT_INFO = (data: unknown, operation?: string): void => {
  PRINT(util.inspect(data), "info", operation);
};

const PRINT_DEBUG = (data: unknown, operation?: string): void => {
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
    const { response } = error as AxiosError;
    LOGGER.error(util.inspect(response.data));
  }
};

const PRINT_SILLY = (data: string | JSON, operation?: string): void => {
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

/**
 * convert a Base64 encoded string with new lines to a hexadecimal string<br/>
 * @name b64nltohex
 * @function
 * @param {String} s Base64 encoded string with new lines
 * @return {String} hexadecimal string
 * @since base64x 1.1.3
 * @description
 * This function converts from a Base64 encoded
 * string with new lines to a hexadecimal string.
 * This is useful to handle PEM encoded file.
 * This function removes any non-Base64 characters (i.e. not 0-9,A-Z,a-z,\,+,=)
 * including new line.
 * @example
 * hextob64nl(
 * "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4\r\n" +
 * "OTAxMjM0NTY3ODkwCg==\r\n")
 * &rarr;
 * "123456789012345678901234567890123456789012345678901234567890"
 */
const b64nltohex = (s: string): string => {
  const b64 = s.replace(/[^0-9A-Za-z/+=]*/g, "");
  const hex = toHex(b64);
  return hex;
};

/**
 * get hexacedimal string from PEM format data<br/>
 * @name pemtohex
 * @function
 * @param {String} s PEM formatted string
 * @param {String} sHead PEM header string without BEGIN/END(OPTION)
 * @return {String} hexadecimal string data of PEM contents
 * @since jsrsasign 7.2.1 base64x 1.1.12
 * @description
 * This static method gets a hexacedimal string of contents
 * from PEM format data. You can explicitly specify PEM header
 * by sHead argument.
 * Any space characters such as white space or new line
 * will be omitted.<br/>
 * NOTE: Now {@link KEYUTIL.getHexFromPEM} and {@link X509.pemToHex}
 * have been deprecated since jsrsasign 7.2.1.
 * Please use this method instead.
 * NOTE2: From jsrsasign 8.0.14 this can process multi
 * "BEGIN...END" section such as "EC PRIVATE KEY" with "EC PARAMETERS".
 * @example
 * pemtohex("-----BEGIN PUBLIC KEY...") &rarr; "3082..."
 * pemtohex("-----BEGIN CERTIFICATE...", "CERTIFICATE") &rarr; "3082..."
 * pemtohex(" \r\n-----BEGIN DSA PRIVATE KEY...") &rarr; "3082..."
 * pemtohex("-----BEGIN EC PARAMETERS...----BEGIN EC PRIVATE KEY...." &rarr; "3082..."
 */
const pemtohex = (s: string, sHead: string): string => {
  if (s.indexOf("-----BEGIN ") === -1)
    throw new BadRequestError(`can't find PEM header: ${sHead}`);
  let inputData = s;
  if (sHead !== undefined) {
    inputData = inputData.replace(
      new RegExp(`^[^]*-----BEGIN ${sHead}-----`),
      ""
    );
    inputData = inputData.replace(
      new RegExp(`-----END ${sHead}-----[^]*$`),
      ""
    );
  } else {
    inputData = inputData.replace(/^[^]*-----BEGIN [^-]+-----/, "");
    inputData = inputData.replace(/-----END [^-]+-----[^]*$/, "");
  }
  return b64nltohex(inputData);
};

const replaceNewLines = (str: string): string =>
  str.replace(/[^0-9A-Za-z/+=]*/g, "");

const replacePemNewLines = (pem: string, sHead: string): string => {
  const header = `-----BEGIN ${sHead}-----`;
  const footer = `-----END ${sHead}-----`;
  const strippedData = replaceNewLines(
    pem.replace(header, "").replace(footer, "")
  );
  return `${header}${strippedData}${footer}`;
};

const replacePemHeaderAndNewLines = (pem: string, sHead: string): string => {
  const header = `-----BEGIN ${sHead}-----`;
  const footer = `-----END ${sHead}-----`;
  return replaceNewLines(pem.replace(header, "").replace(footer, ""));
};

export {
  toHex,
  pemtohex,
  PRINT_INFO,
  PRINT_DEBUG,
  PRINT_ERROR,
  PRINT_SILLY,
  generateKeys,
  prefixWith0x,
  replaceNewLines,
  getIssuanceDate,
  replacePemNewLines,
  replacePemHeaderAndNewLines,
};
