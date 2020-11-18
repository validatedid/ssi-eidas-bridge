import { JWK } from "jose";
import { ethers } from "ethers";
import { KeyType, Curves } from "../src/dtos/keys";

const prefixWith0x = (key: string): string => {
  return key.startsWith("0x") ? key : `0x${key}`;
};

const generateTestKeys = (
  keyType: KeyType,
  curveType: Curves
): {
  hexPrivateKey: string;
  did: string;
  jwk: JWK.ECKey;
} => {
  let jwk: JWK.ECKey;
  let wallet: ethers.Wallet;
  let did: string;
  let hexPrivateKey: string;

  switch (keyType) {
    case "EC":
      switch (curveType) {
        case "secp256k1":
          jwk = JWK.generateSync(keyType, curveType, { use: "sig" });
          hexPrivateKey = Buffer.from(jwk.d as string, "base64").toString(
            "hex"
          );
          wallet = new ethers.Wallet(prefixWith0x(hexPrivateKey));
          did = `did:vid:${wallet.address}`;
          return { hexPrivateKey, did, jwk };
        default:
          throw new Error("secp256k1 only curveType supported");
      }
    default:
      throw new Error("EC only keyType supported");
  }
};

export default generateTestKeys;
