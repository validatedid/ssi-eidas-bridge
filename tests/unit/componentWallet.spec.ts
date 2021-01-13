import { ethers } from "ethers";
import { WalletOptions } from "../../src/dtos/wallet";
import { ComponentWallet } from "../../src/libs/secureEnclave";
import { util } from "../../src/utils";
import getJWKfromHex from "../../src/utils/jwk";
import redis from "../../src/libs/storage/redis";

const key = util.generateKeys();
const ethWallet = new ethers.Wallet(util.prefixWith0x(util.toHex(key.d)));

describe("component wallet test suite", () => {
  afterAll(async () => {
    await redis.quit();
  });
  describe("wallet builder test suite", () => {
    it("should return a wallet", () => {
      expect.assertions(1);
      const options: WalletOptions = {
        privateKey: ethWallet.privateKey,
      };

      const wallet = ComponentWallet.componentWalletBuilder(options);
      expect(wallet).toBeDefined();
    });
  });

  describe("other public component wallet calls", () => {
    it("should load a wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      const loadedWallet = wallet.loadFromPrivateKey(ethWallet.privateKey);
      expect(loadedWallet).toBeDefined();
    });

    it("should return encrypted keys from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      const outEncryptedKey = wallet.exportPrivateKey();
      expect(outEncryptedKey).toMatch(ethWallet.privateKey);
    });

    it("should return a signature from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      const payload = Buffer.from(JSON.stringify({ data: "some test data" }));
      const jws = wallet.signJwt(payload);
      expect(jws).toBeDefined();
    });

    it("should return the public key from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      const pubKey = wallet.publicKey;
      expect(pubKey).toMatch(
        new ethers.utils.SigningKey(ethWallet.privateKey).publicKey
      );
    });

    it("should return the private key from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      const { privateKey } = wallet;
      expect(privateKey).toMatch(ethWallet.privateKey);
    });

    it("should return true on hasJWK from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      expect(wallet.hasJWK()).toBe(true);
    });

    it("should return a JWKECKey from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
      const eidasKey = getJWKfromHex(
        signingKey.publicKey,
        signingKey.privateKey
      );
      expect(wallet.toJWK()).toMatchObject(eidasKey.toJWK(true));
    });

    it("should return the correct did from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      expect(wallet.getDid()).toMatch(`did:vid:${ethWallet.address}`);
    });

    it("should correctly decrypt the data encrypted from a loaded wallet", () => {
      expect.assertions(1);
      const wallet = new ComponentWallet();
      wallet.loadFromPrivateKey(ethWallet.privateKey);
      const data = Buffer.from(JSON.stringify({ data: "some test data" }));
      expect(wallet.decrypt(wallet.encrypt(data))).toMatchObject(data);
    });
  });
});
