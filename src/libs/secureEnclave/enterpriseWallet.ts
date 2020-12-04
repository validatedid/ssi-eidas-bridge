import { createJwt, SimpleSigner } from "@cef-ebsi/did-jwt";
import { JWK } from "jose";
import { ethers } from "ethers";
import * as util from "../../utils/util";
import { JWTHeader } from "./jwt";
import { DEFAULT_EIDAS_VERIFICATION_METHOD, JWT_ALG } from "../eidas/constants";
import redis from "../storage/redis";
import getJWKfromHex from "./jwk";
import { keys } from "../../dtos";
import { EidasKeysData } from "../../dtos/redis";
import { ApiErrorMessages, InternalError } from "../../errors";
import { parseP12File } from "../../utils";
import { signCadesRsa } from "../eidas/cades";
import {
  CadesSignatureInput,
  CadesSignatureOutput,
  HashAlg,
} from "../../dtos/cades";

export default class EnterpriseWallet {
  private issuerPemCert!: string | string[];

  private issuerPemPrivateKey!: string;

  private issuerKeyType!: keys.KeyType;

  private issuerKeyCurve!: keys.Curves;

  constructor(did: string, password: string) {
    const asyncConstructor = async (
      inputDid: string
    ): Promise<EidasKeysData> => {
      const data = await redis.get(inputDid);
      if (!data) {
        throw new InternalError(ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA);
      }
      return JSON.parse(data) as EidasKeysData;
    };
    asyncConstructor(did)
      .then((storedData) => {
        const parsedData = parseP12File(
          Buffer.from(storedData.p12).toString("binary"),
          password
        );
        this.issuerPemCert = parsedData.pemCert;
        this.issuerPemPrivateKey = parsedData.pemPrivateKey;
        this.issuerKeyType = storedData.keyType;
        if (storedData.keyCurve) this.issuerKeyCurve = storedData.keyCurve;
      })
      .catch((e) => {
        throw new InternalError(
          `${ApiErrorMessages.ERROR_ENTERPRISE_WALLET_CONSTRUCTOR} : 
            ${(e as Error).message}`
        );
      });
  }

  eSeal(payload: Record<string, unknown>): CadesSignatureOutput {
    if (this.issuerKeyType !== "RSA")
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.KEY_TYPE_NOT_SUPPORTED,
      });
    // !!! TODO: to canonalize the payload before sending it
    const inputCades: CadesSignatureInput = {
      data: JSON.stringify(payload),
      pemCert: Array.isArray(this.issuerPemCert)
        ? this.issuerPemCert[this.issuerPemCert.length - 1]
        : this.issuerPemCert,
      pemPrivKey: this.issuerPemPrivateKey,
    };
    return signCadesRsa(inputCades);
  }

  static async signDidJwt(
    issuer: string,
    data: Buffer,
    expiresIn?: number
  ): Promise<string> {
    const storedKeys = await redis.get(issuer);
    const jwk = storedKeys
      ? this.getJwkfromKeys(storedKeys)
      : util.generateKeys();
    const signer = SimpleSigner(util.toHex(<string>jwk.d).replace("0x", "")); // Removing 0x from wallet private key as input of SimpleSigner
    const header: JWTHeader = {
      alg: JWT_ALG,
      typ: "JWT",
      kid: `${issuer}${DEFAULT_EIDAS_VERIFICATION_METHOD}`,
    };
    const jwt = await createJwt(
      JSON.parse(data.toString()),
      {
        issuer: EnterpriseWallet.getDid(jwk),
        alg: JWT_ALG,
        signer,
        expiresIn,
      },
      header
    );

    return jwt;
  }

  static getJwkfromKeys(inputKeys: string): JWK.ECKey {
    const wallet: ethers.Wallet = new ethers.Wallet(
      util.prefixWith0x(inputKeys)
    );
    const { privateKey } = new ethers.utils.SigningKey(wallet.privateKey);
    const { publicKey } = new ethers.utils.SigningKey(wallet.privateKey);
    return getJWKfromHex(publicKey, privateKey);
  }

  static getDid(jwk: JWK.ECKey): string {
    const wallet = new ethers.Wallet(
      util.prefixWith0x(util.toHex(<string>jwk.d))
    );
    return `did:vid:${wallet.address}`;
  }
}
