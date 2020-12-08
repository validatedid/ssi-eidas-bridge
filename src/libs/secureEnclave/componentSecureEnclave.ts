import { JWKECKey } from "jose";
import Wallet, { WalletOptions } from "../../dtos/wallet";
import ComponentWallet from "./componentWallet";
import { ApiErrorMessages, InternalError } from "../../errors";
import { PRINT_DEBUG } from "../../utils/util";

export interface InitComponent {
  did: string;
  key: JWKECKey;
}

/**
 * Class to a Secure Enclave
 */
export default class ComponentSecureEnclave {
  protected static instance: ComponentSecureEnclave;

  protected wallets: Map<string, Wallet>;

  protected EnclaveDid: string;

  protected constructor() {
    this.wallets = new Map<string, Wallet>();
    this.EnclaveDid = "";
  }

  /**
   * Returns an instance of the created SecureEnclave
   * Used when it is not known the constructor parameters, which
   * should be known only in the controller class
   */
  static get Instance(): ComponentSecureEnclave {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }

  get enclaveDid(): string {
    return this.EnclaveDid;
  }

  set enclaveDid(did: string) {
    this.EnclaveDid = did;
  }

  getWallet(did: string): Wallet | undefined {
    return this.wallets.get(did);
  }

  /**
   * Inits the enclave at startup.
   * Loads the enclave's wallet from keyDB if exists, otherwise it creates a new wallet (thus a new DID
   * for the component).
   *
   * @param encryptedKeystore, Optionally, keystore can be provided as input parameter.
   */
  init(hexEncodedPrivateKey: string, privateKey?: boolean): InitComponent {
    // If Did exists, return it.
    if (this.enclaveDid !== "") {
      const outKey = (this.getWallet(this.enclaveDid) as ComponentWallet).toJWK(
        false
      );
      return { did: this.enclaveDid, key: outKey };
    }

    if (!hexEncodedPrivateKey)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.ERROR_ON_COMPONENT_WALLET_INIT,
      });
    const did = this.restoreWallet({
      privateKey: hexEncodedPrivateKey,
    });
    this.enclaveDid = did;
    const key = (this.getWallet(did) as ComponentWallet).toJWK(privateKey);
    return { did, key };
  }

  /**
   * Adds a new wallet to the Enclave
   * @param options
   */
  addNewWallet(options?: WalletOptions): string {
    const wallet = ComponentWallet.componentWalletBuilder(options);
    this.wallets.set(wallet.getDid(), wallet);
    return wallet.getDid();
  }

  /**
   * Restores a wallet from a JSON encrypted file
   * @param options
   */
  restoreWallet(options?: WalletOptions): string {
    return this.addNewWallet(options);
  }

  getPublicKey(did: string): string {
    const wallet = this.wallets.get(did);
    if (!wallet)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.WALLET_NOT_FOUND,
      });

    return wallet.publicKey;
  }

  exportPrivateKey(did: string): string {
    const wallet = this.wallets.get(did);
    if (!wallet)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.WALLET_NOT_FOUND,
      });

    return wallet.exportPrivateKey();
  }

  signJwt(did: string, data: Buffer): string {
    const wallet = this.wallets.get(did);
    if (!wallet)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.WALLET_NOT_FOUND,
      });

    return wallet.signJwt(data);
  }

  // encrypt data using Component public key
  encrypt(dataToEncrypt: Buffer): Buffer {
    PRINT_DEBUG(this.enclaveDid);
    const wallet = this.getWallet(this.enclaveDid);
    if (!wallet)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.WALLET_NOT_FOUND,
      });

    return wallet.encrypt(dataToEncrypt);
  }

  // decrypt data using Component protected key
  decrypt(dataToDecrypt: Buffer): Buffer {
    PRINT_DEBUG(this.enclaveDid);
    const wallet = this.getWallet(this.enclaveDid);
    if (!wallet)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.WALLET_NOT_FOUND,
      });

    return wallet.decrypt(dataToDecrypt);
  }
}
