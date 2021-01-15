import { JWK } from "jose/types";
import SignJWT from "jose/jwt/sign";
import fromKeyLike from "jose/jwk/from_key_like";
import parseJwk from "jose/jwk/parse";
import { encrypt, decrypt } from "eciesjs";
import { ethers } from "ethers";
import { WalletOptions } from "../../dtos/wallet";
import { InternalError, ApiErrorMessages } from "../../errors";
import getJWKfromHex from "../../utils/jwk";
import { util } from "../../utils";

export default class ComponentWallet {
  static componentWalletBuilder(options?: WalletOptions): ComponentWallet {
    if (!options)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.WALLET_OPTIONS_NOT_PROVIDED,
      });

    const wallet = new ComponentWallet();

    if (!options.privateKey)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.COMPONENT_WALLET_KEY_NOT_PROVIDED,
      });
    wallet.loadFromPrivateKey(options.privateKey);

    return wallet;
  }

  ethAddress: string;

  protected jwk!: JWK;

  protected publicJwk!: JWK;

  protected wallet!: ethers.Wallet;

  async init(): Promise<void> {
    const key = util.generateKeys();
    this.jwk = await fromKeyLike(key.privateKey);
    this.publicJwk = await fromKeyLike(key.publicKey);
    this.initFromECKeys(this.jwk);
  }

  initFromECKeys(jwk: JWK): void {
    this.wallet = new ethers.Wallet(util.prefixWith0x(util.toHex(jwk.d)));
    this.ethAddress = this.wallet.address;
  }

  loadFromPrivateKey(hexEncodedPrivKey: string): ethers.Wallet {
    const wallet: ethers.Wallet = new ethers.Wallet(
      util.prefixWith0x(hexEncodedPrivKey)
    );

    this.wallet = wallet;
    this.ethAddress = wallet.address;
    const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
    this.jwk = getJWKfromHex(signingKey.publicKey, signingKey.privateKey);
    this.publicJwk = getJWKfromHex(signingKey.publicKey);

    return wallet;
  }

  exportPrivateKey(): string {
    return this.privateKey;
  }

  async signJwt(payload: Buffer): Promise<string> {
    const privateKey = await parseJwk(this.jwk, "ES256K");

    const jwt = await new SignJWT(JSON.parse(payload.toString()))
      .setProtectedHeader({
        alg: "ES256K",
        typ: "JWT",
      })
      .sign(privateKey);

    return jwt;
  }

  get publicKey(): string {
    return new ethers.utils.SigningKey(this.wallet.privateKey).publicKey;
  }

  get privateKey(): string {
    return this.wallet.privateKey;
  }

  toJWK(withPrivate = true): JWK {
    if (withPrivate) return this.jwk;
    return this.publicJwk;
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
