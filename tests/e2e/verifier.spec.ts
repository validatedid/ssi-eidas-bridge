import { JWK } from "jose";
import { createJwt, SimpleSigner } from "did-jwt";
import { ethers } from "ethers";
import { initSecureEnclave } from "../../auxAPICalls";
import { Verifier } from "../../../src/libs/secureEnclave";
import { VerifiedJwt } from "../../../src/libs/secureEnclave/jwt";
import util from "../../../src/utils";

describe("verifier", () => {
  describe("when calling verifyVcJwt", () => {
    it("should verify a JWT sent from the frontend", async () => {
      expect.assertions(1);
      await initSecureEnclave();
      // EXTRACTED FROM USER WALLET -> ONLY USED HERE FOR TESTING PURPOSES
      const jwk = JWK.generateSync("EC", "secp256k1", { use: "sig" });
      const privKeyString = Buffer.from(<string>jwk.d, "base64").toString(
        "hex"
      );
      const wallet: ethers.Wallet = new ethers.Wallet(
        util.prefixWith0x(privKeyString)
      );
      const did = `did:vid:${wallet.address}`;

      const vc = {
        iat: 1576596476,
        ticket:
          "ST-12585-XOQNiwBrSiIFFscATXPSzU5vTGSHYBLOfydZ3BhorzLGxddogZwyldv0asKeoPeXWHK4vIzzXp2WUttnVpMS4dq-NaAc23CqASeA7AKKjMH3NO-pr5EHazqjQUvSTyPW1SjIeRmPks7hXAStYy2kuGzidNW",
        publicKey: null,
        iss: did,
      };

      const signer = SimpleSigner(wallet.privateKey.replace("0x", "")); // Removing 0x from wallet private key as input of SimpleSigner
      const jwt = await createJwt(vc, {
        issuer: `${did}`,
        alg: "ES256K-R",
        signer,
      });

      const verifier = Verifier.Instance;
      const verified: VerifiedJwt = await verifier.verifyVcJwt(jwt);
      expect(verified.payload.iss).toBe(did);
    });
  });
});
