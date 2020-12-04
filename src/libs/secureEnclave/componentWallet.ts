import { JWT, JWK, JWKECKey } from "jose";
import { encrypt, decrypt } from "eciesjs";
import { ethers } from "ethers";
import Wallet, { WalletOptions } from "./wallet";
import { InternalError, ApiErrorMessages } from "../../errors";
import getJWKfromHex from "./jwk";
import { util } from "../../utils";

export default class ComponentWallet implements Wallet {
  static async componentWalletBuilder(
    options?: WalletOptions
  ): Promise<ComponentWallet> {
    if (!options)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.WALLET_OPTIONS_NOT_PROVIDED,
      });

    const wallet = new ComponentWallet();

    if (!options.privateKey)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.COMPONENT_WALLET_KEY_NOT_PROVIDED,
      });
    await wallet.loadFromPrivateKey(options.privateKey);

    return wallet;
  }

  ethAddress: any;

  protected jwk!: JWK.ECKey;

  protected wallet!: ethers.Wallet;

  async init(): Promise<void> {
    this.jwk = util.generateKeys();
    await this.initFromECKeys(this.jwk);
  }

  async initFromECKeys(jwk: JWK.ECKey): Promise<void> {
    this.wallet = new ethers.Wallet(
      util.prefixWith0x(util.toHex(<string>jwk.d))
    );
    this.ethAddress = this.wallet.address;
  }

  async loadFromPrivateKey(hexEncodedPrivKey: string): Promise<ethers.Wallet> {
    const wallet: ethers.Wallet = new ethers.Wallet(
      util.prefixWith0x(hexEncodedPrivKey)
    );

    this.wallet = wallet;
    this.ethAddress = wallet.address;
    const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
    this.jwk = getJWKfromHex(signingKey.publicKey, signingKey.privateKey);

    return wallet;
  }

  exportPrivateKey(): string {
    return this.privateKey;
  }

  signJwt(payload: Buffer): string {
    const jws = JWT.sign(JSON.parse(payload.toString()), this.jwk, {
      header: {
        alg: "ES256K",
        typ: "JWT",
      },
    });

    return jws;
  }

  get publicKey(): string {
    return new ethers.utils.SigningKey(this.wallet.privateKey).publicKey;
  }

  get privateKey(): string {
    return this.wallet.privateKey;
  }

  hasJWK(): boolean {
    return JWK.isKey(this.jwk);
  }

  toJWK(withPrivate = true): JWKECKey {
    return this.jwk.toJWK(withPrivate);
  }

  getDid(): string {
    return `did:vid:${this.ethAddress}`;
  }

  // encrypt data using Component public key
  encrypt(dataToEncrypt: Buffer): Buffer {
    return encrypt(this.publicKey, dataToEncrypt);
  }

  // decrypt data using Component private key
  decrypt(dataToDecrypt: Buffer): Buffer {
    return decrypt(this.privateKey, dataToDecrypt);
  }
}
