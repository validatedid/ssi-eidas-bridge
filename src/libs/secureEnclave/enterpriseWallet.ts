import { createJwt, SimpleSigner } from "@cef-ebsi/did-jwt";
import { JWK } from "jose";
import { ethers } from "ethers";
import * as util from "../../utils/util";
import { JWTHeader } from "../../dtos/jwt";
import {
  DEFAULT_EIDAS_VERIFICATION_METHOD,
  JWT_ALG,
} from "../../@types/constants";
import redis from "../storage/redis";
import getJWKfromHex from "../../utils/jwk";
import { EidasKeysData } from "../../dtos/redis";
import { ApiErrorMessages, BadRequestError, InternalError } from "../../errors";
import { eidasCrypto } from "../../utils";
import { signCadesRsa } from "./cades";
import { CadesSignatureInput, CadesSignatureOutput } from "../../dtos/cades";
import constants from "../../@types";
import { WalletBuilderOptions } from "../../dtos/wallet";
import { canonizeCredential } from "../../utils/ssi";

export default class EnterpriseWallet {
  private constructor(
    private issuerPemCert: string[],
    private issuerPemPrivateKey: string,
    private issuerKeyType: constants.KeyType,
    private issuerKeyCurve?: constants.Curves
  ) {}

  static async createInstance(
    options: WalletBuilderOptions
  ): Promise<EnterpriseWallet> {
    if (!options || !options.did || !options.password)
      throw new BadRequestError(ApiErrorMessages.WALLET_BUILDER_BAD_PARAMS);

    let storedData: EidasKeysData;
    try {
      const data = await redis.get(options.did);
      storedData = JSON.parse(data) as EidasKeysData;
    } catch (error) {
      throw new InternalError(
        `${ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA} : ${
          (error as Error).message
        }`
      );
    }

    if (
      !storedData.p12 ||
      !storedData.keyType ||
      (storedData.keyType === constants.KeyTypes.EC && !storedData.keyCurve) ||
      (storedData.keyType === constants.KeyTypes.OKP && !storedData.keyCurve)
    )
      throw new InternalError(ApiErrorMessages.ERROR_RETRIEVING_REDIS_DATA);

    const parsedData = eidasCrypto.parseP12File(
      Buffer.from(storedData.p12).toString("binary"),
      options.password
    );
    if (!parsedData || !parsedData.pemCert || !parsedData.pemPrivateKey)
      throw new InternalError(ApiErrorMessages.ERROR_PARSING_P12_DATA);
    return new this(
      parsedData.pemCert,
      parsedData.pemPrivateKey,
      storedData.keyType,
      storedData.keyCurve
    );
  }

  async eSeal(payload: Record<string, unknown>): Promise<CadesSignatureOutput> {
    if (this.issuerKeyType !== constants.KeyTypes.RSA)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.KEY_TYPE_NOT_SUPPORTED,
      });

    const inputCades: CadesSignatureInput = {
      data: await canonizeCredential(payload),
      pemCert: this.issuerPemCert[this.issuerPemCert.length - 1],
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
    const signer = SimpleSigner(util.toHex(jwk.d).replace("0x", "")); // Removing 0x from wallet private key as input of SimpleSigner
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
    const wallet = new ethers.Wallet(util.prefixWith0x(util.toHex(jwk.d)));
    return `did:vid:${wallet.address}`;
  }
}
