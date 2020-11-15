import { createJwt, SimpleSigner } from "@cef-ebsi/did-jwt";
import { JWK } from "jose";
import { ethers } from "ethers";
import * as util from "../../utils/util";
import { JWTHeader } from "./jwt";
import { DEFAULT_EIDAS_VERIFICATION_METHOD, JWT_ALG } from "../eidas/constants";
import redis from "../storage/redis";
import getJWKfromHex from "./jwk";

export default class EnterpriseWallet {
  static async signDidJwt(
    issuer: string,
    data: Buffer,
    expiresIn?: number
  ): Promise<string> {
    let jwk = util.generateKeys();
    const storedKeys = await redis.get(issuer);
    if (storedKeys) {
      const wallet: ethers.Wallet = new ethers.Wallet(
        util.prefixWith0x(storedKeys)
      );
      const { privateKey } = new ethers.utils.SigningKey(wallet.privateKey);
      const { publicKey } = new ethers.utils.SigningKey(wallet.privateKey);
      jwk = getJWKfromHex(publicKey, privateKey);
    }
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

  static getDid(jwk: JWK.ECKey): string {
    const wallet = new ethers.Wallet(
      util.prefixWith0x(util.toHex(<string>jwk.d))
    );
    return `did:vid:${wallet.address}`;
  }
}
