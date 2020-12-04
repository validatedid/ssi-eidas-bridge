import { decodeJwt } from "did-jwt";
import Controller from "../../src/api/eidas/controller";
import { EnterpriseWallet, Verifier } from "../../src/libs/secureEnclave";
import { SignatureTypes } from "../../src/libs/secureEnclave/jwt";
import {
  DEFAULT_PROOF_PURPOSE,
  DEFAULT_EIDAS_VERIFICATION_METHOD,
} from "../../src/libs/eidas/constants";

jest.mock("did-jwt", () => ({
  decodeJwt: jest.fn(),
}));

describe("controller suite tests", () => {
  describe("eidas signature calls", () => {
    it("should throw an error without signPayload", async () => {
      expect.assertions(1);
      await expect(Controller.EIDASsignature(undefined as any)).rejects.toThrow(
        "Bad Request"
      );
    });

    it("should throw an error without signPayload issuer", async () => {
      expect.assertions(1);
      const signPayload = {};
      await expect(
        Controller.EIDASsignature(signPayload as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without signPayload payload", async () => {
      expect.assertions(1);
      const signPayload = {
        issuer: "did:vid",
      };
      await expect(
        Controller.EIDASsignature(signPayload as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without signPayload type", async () => {
      expect.assertions(1);
      const signPayload = {
        issuer: "did:vid",
        payload: {},
      };
      await expect(
        Controller.EIDASsignature(signPayload as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without signPayload correct type", async () => {
      expect.assertions(1);
      const signPayload = {
        issuer: "did:vid",
        payload: {},
        type: "a type",
      };
      await expect(
        Controller.EIDASsignature(signPayload as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error when signdidjwt does not return a value", async () => {
      expect.assertions(1);
      const signPayload = {
        issuer: "did:vid",
        payload: {},
        type: SignatureTypes.EidasSeal2019,
      };
      jest
        .spyOn(EnterpriseWallet, "signDidJwt")
        .mockResolvedValue(undefined as any);
      await expect(
        Controller.EIDASsignature(signPayload as any)
      ).rejects.toThrow("Internal Server Error");
    });

    it("should return a value", async () => {
      expect.assertions(1);
      const signPayload = {
        issuer: "did:vid",
        payload: {},
        type: SignatureTypes.EidasSeal2019,
      };
      jest
        .spyOn(EnterpriseWallet, "signDidJwt")
        .mockResolvedValue("token-string");
      jest
        .spyOn(Controller, "getIssuanceDate")
        .mockReturnValue(new Date().toISOString());
      const response = await Controller.EIDASsignature(signPayload);
      const expectedResponse = {
        issuer: signPayload.issuer,
        proof: {
          type: SignatureTypes.EidasSeal2019,
          created: expect.any(String),
          proofPurpose: DEFAULT_PROOF_PURPOSE,
          verificationMethod: `${signPayload.issuer}${DEFAULT_EIDAS_VERIFICATION_METHOD}`,
          jws: "token-string",
        },
      };
      expect(response).toMatchObject(expectedResponse);
    });
  });
  describe("eidas verification calls", () => {
    it("should throw an error without proof", async () => {
      expect.assertions(1);
      await expect(
        Controller.EIDASvalidateSignature(undefined as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without proof type", async () => {
      expect.assertions(1);
      const proof = {};
      await expect(
        Controller.EIDASvalidateSignature(proof as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without proof created", async () => {
      expect.assertions(1);
      const proof = {
        type: SignatureTypes.EidasSeal2019,
      };
      await expect(
        Controller.EIDASvalidateSignature(proof as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without proof purpose", async () => {
      expect.assertions(1);
      const proof = {
        type: SignatureTypes.EidasSeal2019,
        created: new Date().toISOString(),
      };
      await expect(
        Controller.EIDASvalidateSignature(proof as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without proof verificationMethod", async () => {
      expect.assertions(1);
      const proof = {
        type: SignatureTypes.EidasSeal2019,
        created: new Date().toISOString(),
        proofPurpose: DEFAULT_PROOF_PURPOSE,
      };
      await expect(
        Controller.EIDASvalidateSignature(proof as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without proof jws", async () => {
      expect.assertions(1);
      const proof = {
        type: SignatureTypes.EidasSeal2019,
        created: new Date().toISOString(),
        proofPurpose: DEFAULT_PROOF_PURPOSE,
        verificationMethod: `did:vid:0x00${DEFAULT_EIDAS_VERIFICATION_METHOD}`,
      };
      await expect(
        Controller.EIDASvalidateSignature(proof as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error without correct proof type", async () => {
      expect.assertions(1);
      const proof = {
        type: "another type",
        created: new Date().toISOString(),
        proofPurpose: DEFAULT_PROOF_PURPOSE,
        verificationMethod: `did:vid:0x00${DEFAULT_EIDAS_VERIFICATION_METHOD}`,
        jws: "a jws signature",
      };
      await expect(
        Controller.EIDASvalidateSignature(proof as any)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error with a Bad Signature", async () => {
      expect.assertions(1);
      const proof = {
        type: SignatureTypes.EidasSeal2019,
        created: new Date().toISOString(),
        proofPurpose: DEFAULT_PROOF_PURPOSE,
        verificationMethod: `did:vid:0x00${DEFAULT_EIDAS_VERIFICATION_METHOD}`,
        jws: "a jws signature",
      };
      jest
        .spyOn(Verifier.Instance, "verifyVcJwt")
        .mockResolvedValue(undefined as any);
      await expect(
        Controller.EIDASvalidateSignature(proof as any)
      ).rejects.toThrow("Internal Server Error");
    });

    it("should return a verified signature", async () => {
      expect.assertions(1);
      const proof = {
        type: SignatureTypes.EidasSeal2019,
        created: new Date().toISOString(),
        proofPurpose: DEFAULT_PROOF_PURPOSE,
        verificationMethod: `did:vid:0x00${DEFAULT_EIDAS_VERIFICATION_METHOD}`,
        jws: "a jws signature",
      };
      const verifiedResult = {
        payload: {},
        jwt: proof.jws,
      };
      jest
        .spyOn(Verifier.Instance, "verifyVcJwt")
        .mockResolvedValue(verifiedResult);

      const result = await Controller.EIDASvalidateSignature(proof);
      expect(result).toMatchObject(verifiedResult);
    });
  });

  describe("getIssuanceDate call tests", () => {
    it("should return the issuance date", () => {
      expect.assertions(1);
      (decodeJwt as jest.Mock).mockReturnValue({
        payload: { iat: new Date(1998, 11) },
      });
      expect(Controller.getIssuanceDate("a token")).toBeDefined();
      jest.clearAllMocks();
    });

    it("should return the issuance date when no iat is passed", () => {
      expect.assertions(1);
      (decodeJwt as jest.Mock).mockReturnValue({ payload: {} });
      expect(Controller.getIssuanceDate("a token")).toBeDefined();
      jest.clearAllMocks();
    });
  });
});
