import { decodeJwt, ebsiVerifyJwt } from "@cef-ebsi/did-jwt";
import { Verifier } from "../../src/libs/secureEnclave";
import { VerifiedJwt } from "../../src/libs/secureEnclave/jwt";
import { ApiErrorMessages, BadRequestError } from "../../src/errors";

jest.mock("@cef-ebsi/did-jwt", () => ({
  decodeJwt: jest.fn(),
  ebsiVerifyJwt: jest.fn(),
}));

describe("verifier", () => {
  describe("when calling verifyVcJwt", () => {
    it("should verify a JWT", async () => {
      expect.assertions(1);
      const jwt = "a token jwt";
      const did = "did:vid:0xAf3fAf5F4618a096d242B8f3F8B35748Ca9F64d5";
      (decodeJwt as jest.Mock) = jest
        .fn()
        .mockImplementation(() => ({ payload: {} }));
      (ebsiVerifyJwt as jest.Mock) = jest.fn().mockImplementation(() => ({
        payload: {
          iss: did,
        },
      }));

      const verifier = Verifier.Instance;
      const verified: VerifiedJwt = await verifier.verifyVcJwt(jwt);
      expect(verified.payload.iss).toBe(did);
    });

    it("should verify a JWT with audience as a callback", async () => {
      expect.assertions(1);
      const jwt = "a token jwt";
      const did = "did:vid:0xAf3fAf5F4618a096d242B8f3F8B35748Ca9F64d5";
      (decodeJwt as jest.Mock) = jest.fn().mockImplementation(() => ({
        payload: { aud: "https://self.issued.me" },
      }));
      (ebsiVerifyJwt as jest.Mock) = jest.fn().mockImplementation(() => ({
        payload: {
          iss: did,
        },
      }));

      const verifier = Verifier.Instance;
      const verified: VerifiedJwt = await verifier.verifyVcJwt(jwt);
      expect(verified.payload.iss).toBe(did);
      jest.resetAllMocks();
    });

    it("should verify a JWT with audience as a did", async () => {
      expect.assertions(1);
      const jwt = "a token jwt";
      const did = "did:vid:0xAf3fAf5F4618a096d242B8f3F8B35748Ca9F64d5";
      (decodeJwt as jest.Mock) = jest.fn().mockImplementation(() => ({
        payload: { aud: did },
      }));
      (ebsiVerifyJwt as jest.Mock) = jest.fn().mockImplementation(() => ({
        payload: {
          iss: did,
        },
      }));

      const verifier = Verifier.Instance;
      const verified: VerifiedJwt = await verifier.verifyVcJwt(jwt);
      expect(verified.payload.iss).toBe(did);
      jest.resetAllMocks();
    });

    it("should throw an error on verifyJWT", async () => {
      expect.assertions(1);
      const jwt = "a token jwt";
      (decodeJwt as jest.Mock) = jest.fn().mockImplementation(() => ({
        payload: {},
      }));
      (ebsiVerifyJwt as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new Error("Error on verify"));

      const verifier = Verifier.Instance;
      await expect(verifier.verifyVcJwt(jwt)).rejects.toThrow(
        "Error on verify"
      );
      jest.resetAllMocks();
    });

    it("should throw an Invalid Audience error on getAudience", async () => {
      expect.assertions(1);
      const jwt = "a token jwt";
      (decodeJwt as jest.Mock) = jest.fn().mockImplementation(() => ({
        payload: { aud: ["one", "two"] },
      }));

      const verifier = Verifier.Instance;
      await expect(verifier.verifyVcJwt(jwt)).rejects.toThrow(
        new BadRequestError(BadRequestError.defaultTitle, {
          detail: ApiErrorMessages.INVALID_AUDIENCE,
        })
      );
      jest.resetAllMocks();
    });

    it("should throw an No Audience error on getAudience", async () => {
      expect.assertions(1);
      const jwt = "a token jwt";
      (decodeJwt as jest.Mock) = jest.fn().mockImplementation(() => ({}));

      const verifier = Verifier.Instance;
      await expect(verifier.verifyVcJwt(jwt)).rejects.toThrow(
        new BadRequestError(BadRequestError.defaultTitle, {
          detail: ApiErrorMessages.NO_AUDIENCE,
        })
      );
      jest.resetAllMocks();
    });
  });
});
