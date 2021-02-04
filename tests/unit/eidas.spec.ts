import constants from "../../src/@types";
import {
  compareCredentialKeys,
  validateEIDASProofAttributes,
} from "../../src/libs/eidas/eidas";
import { mockVC } from "../data/credentials";
import redis from "../../src/libs/storage/redis";
import { ApiErrorMessages, BadRequestError } from "../../src/errors";
import { indication } from "../../src/dtos";

const DID_ENTITY = "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D";
const CADES =
  "-----BEGIN PKCS7-----MIIPGQYJKoZIhvcNAQcCoIIPCjCCDwYCAQExDzANBglghkgBZQMEAgEFADCCBFAGCSqGSIb3DQEHAaCCBEEEggQ9PGRpZDprZXk6ejZNa25HYzNvY0hzM3pkUGlKYm5hYXFEaTU4TkdiNHBrMVNwOVd4V3VmdVhTZHhmPiA8aHR0cHM6Ly9leGFtcGxlLm9yZy9leGFtcGxlcyNkZWdyZWU+IF86YzE0bjAgLgo8aHR0cDovL2V4YW1wbGUuZ292L2NyZWRlbnRpYWxzLzM3MzI+IDxodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjdHlwZT4gPGh0dHBzOi8vZXhhbXBsZS5vcmcvZXhhbXBsZXMjVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWw+IC4KPGh0dHA6Ly9leGFtcGxlLmdvdi9jcmVkZW50aWFscy8zNzMyPiA8aHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zI3R5cGU+IDxodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscyNWZXJpZmlhYmxlQ3JlZGVudGlhbD4gLgo8aHR0cDovL2V4YW1wbGUuZ292L2NyZWRlbnRpYWxzLzM3MzI+IDxodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscyNjcmVkZW50aWFsU3ViamVjdD4gPGRpZDprZXk6ejZNa25HYzNvY0hzM3pkUGlKYm5hYXFEaTU4TkdiNHBrMVNwOVd4V3VmdVhTZHhmPiAuCjxodHRwOi8vZXhhbXBsZS5nb3YvY3JlZGVudGlhbHMvMzczMj4gPGh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzI2lzc3VhbmNlRGF0ZT4gIjIwMTAtMDEtMDFUMTk6NzM6MjRaIl5ePGh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hI2RhdGVUaW1lPiAuCjxodHRwOi8vZXhhbXBsZS5nb3YvY3JlZGVudGlhbHMvMzczMj4gPGh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzI2lzc3Vlcj4gPGRpZDprZXk6ejZNa2lUQnoxeW11ZXBBUTRIRUhZU0Yx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-----END PKCS7-----";

describe("eidas test suite", () => {
  afterAll(async () => {
    await redis.quit();
  });
  const mockProof = mockVC.proof;

  describe("eidas proof attributes test suite", () => {
    it("should validate EIDAS Proof Attributes", () => {
      expect.assertions(1);
      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: mockProof.verificationMethod,
        cades: CADES,
      };

      expect(() => validateEIDASProofAttributes(proof)).not.toThrow(
        "Proof must have the minimum required attributes"
      );
    });

    it("should throw Type error on no Proof Type", () => {
      expect.assertions(1);
      const proof = {
        type: "",
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: mockProof.verificationMethod,
        jws: CADES,
      };
      const expectedError = new BadRequestError(indication.VERIFICATION_FAIL, {
        detail: `Proof type is missing ${constants.DEFAULT_EIDAS_PROOF_TYPE}`,
      });
      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        expectedError
      );
    });

    it("should throw Type error on Proof Type incorrect", () => {
      expect.assertions(1);

      const proof = {
        type: "test type",
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: mockProof.verificationMethod,
        jws: CADES,
      };
      const expectedError = new BadRequestError(indication.VERIFICATION_FAIL, {
        detail: `Proof type is missing ${constants.DEFAULT_EIDAS_PROOF_TYPE}`,
      });

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        expectedError
      );
    });

    it("should throw Type error on no Proof Purpose", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: "",
        verificationMethod: mockProof.verificationMethod,
        jws: CADES,
      };
      const expectedError = new BadRequestError(indication.VERIFICATION_FAIL, {
        detail: `Proof Purpose is missing ${constants.DEFAULT_PROOF_PURPOSE}`,
      });
      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        expectedError
      );
    });

    it("should throw Type error on Proof Purpose incorrect", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: "test proof",
        verificationMethod: mockProof.verificationMethod,
        jws: CADES,
      };
      const expectedError = new BadRequestError(indication.VERIFICATION_FAIL, {
        detail: `Proof Purpose is missing ${constants.DEFAULT_PROOF_PURPOSE}`,
      });
      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        expectedError
      );
    });

    it("should throw Type error on no Verification Method", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: "",
        jws: CADES,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `Proof must have the minimum required attributes`
      );
    });

    it("should throw Type error on incorrect Verification Method", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: `${DID_ENTITY}#a verif test`,
        jws: CADES,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `Proof must have the minimum required attributes`
      );
    });

    it("should throw Type error on incorrect Proof keys", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: mockProof.verificationMethod,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        "Proof must have the minimum required attributes"
      );
    });
  });

  describe("compareCredentialKeys test suite", () => {
    it("should return false with first array undefined", () => {
      expect.assertions(1);
      const arr2: string[] = [""];
      expect(compareCredentialKeys(undefined as never, arr2)).toBe(false);
    });

    it("should return false with second array undefined", () => {
      expect.assertions(1);
      const arr1: string[] = [""];
      expect(compareCredentialKeys(arr1, undefined as never)).toBe(false);
    });

    it("should return false with different array lenghts", () => {
      expect.assertions(1);
      const arr1: string[] = ["one", "two"];
      const arr2: string[] = [""];

      expect(compareCredentialKeys(arr1, arr2)).toBe(false);
    });

    it("should return false with one element not found on the second array", () => {
      expect.assertions(1);
      const arr1: string[] = ["one", "two"];
      const arr2: string[] = ["one", "three"];

      expect(compareCredentialKeys(arr1, arr2)).toBe(false);
    });

    it("should return true with same elements", () => {
      expect.assertions(1);
      const arr1: string[] = ["one", "two"];
      const arr2: string[] = ["one", "two"];

      expect(compareCredentialKeys(arr1, arr2)).toBe(true);
    });
  });
});
