import { JWKECKey } from "jose";
import Wallet, { WalletOptions } from "./wallet";

export interface InitComponent {
  did: string;
  key: JWKECKey;
}

export default interface SecureEnclave {
  enclaveDid: string;

  addNewWallet(options?: WalletOptions): Promise<string>;

  exportPrivateKey(did: string): string;

  signJwt(did: string, data: Buffer, password?: string): Promise<any>;

  init(encryptedKeystore: string, privKey?: boolean): Promise<InitComponent>;

  restoreWallet(options?: WalletOptions): Promise<string>;

  getWallet(did: string): Wallet | undefined;

  getPublicKey(did: string): string;

  // encrypt data using Component public key
  encrypt(dataToEncrypt: Buffer): Buffer;

  // decrypt data using Component private key
  decrypt(dataToDecrypt: Buffer): Buffer;
}
