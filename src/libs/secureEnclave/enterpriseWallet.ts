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

export default class EnterpriseWallet {
  private issuerPemCert!: string;

  private issuerPemPrivateKey!: string;

  private issuerKeyType!: keys.KeyType;

  private issuerKeyCurve!: keys.Curves;

  constructor(did: string) {
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
        const p12file = storedData.p12;
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

  static getJwkfromKeys(keys: string): JWK.ECKey {
    const wallet: ethers.Wallet = new ethers.Wallet(util.prefixWith0x(keys));
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
