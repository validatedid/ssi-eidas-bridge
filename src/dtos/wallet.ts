export interface WalletOptions {
  privateKey?: string; // can be validated with ethers' isSecretStorageWallet method
  did?: string;
}

export interface WalletBuilderOptions {
  did: string;
  password: string;
}

export default interface Wallet {
  publicKey: string;
  ethAddress?: string;

  /**
   * Sign the data and creates a JWS with the current key
   * @param data Data to be signed with the current key. Should be a VC JSON object
   */
  signJwt(data: Buffer, password?: string, expiresIn?: number): Promise<string>;

  getDid(): string;

  exportPrivateKey(): string;

  // encrypt data using Component public key
  encrypt(dataToEncrypt: Buffer): Buffer;

  // decrypt data using Component private key
  decrypt(dataToDecrypt: Buffer): Buffer;
}
