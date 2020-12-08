import constants from "../../src/@types";
import {
  compareCredentialKeys,
  validateEIDASProofAttributes,
} from "../../src/libs/eidas/eidas";

const DID_ENTITY = "did:vid:0xB551b70d650892d23dE3Be201A95c1FcBea98A3D";
const VID_JWT =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1Nzg0OTY2MDYsImV4cCI6MzQ1NzA2NjA4OCwic3ViIjoiZGlkOmVic2k6MHgxNjA0OEI4M0ZBZGFDZENCMjAxOThBQmM0NTU2MkRmMUEzZTI4OWFGIiwibmJmIjoxNTYyOTUwMjgyLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vRUJTSS1XRUJTSVRFLkVVL3NjaGVtYXMvdmMvMjAxOS92MSMiLCJodHRwczovL0VCU0ktV0VCU0lURS5FVS9zY2hlbWFzL2VpZGFzLzIwMTkvdjEjIl0sImlkIjoiZWJzaTp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXNzaWZWZXJpZmlhYmxlSUQiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6ZWJzaToweDE2MDQ4QjgzRkFkYUNkQ0IyMDE5OEFCYzQ1NTYyRGYxQTNlMjg5YUYiLCJwZXJzb25JZGVudGlmaWVyIjoiQkUvQkUvMDI2MzU1NDJZIiwiY3VycmVudEZhbWlseU5hbWUiOiJFdmEiLCJjdXJyZW50R2l2ZW5OYW1lIjoiQWRhbXMiLCJiaXJ0aE5hbWUiOiJFdmEiLCJkYXRlT2ZCaXJ0aCI6IjE5OTgtMDItMTQiLCJwbGFjZU9mQmlydGgiOiJCcnVzc2VscyIsImN1cnJlbnRBZGRyZXNzIjoiNDQsIHJ1ZSBkZSBGYW1lIiwiZ2VuZGVyIjoiRmVtYWxlIn19LCJpc3MiOiJkaWQ6ZWJzaToweEI1NTFiNzBkNjUwODkyZDIzZEUzQmUyMDFBOTVjMUZjQmVhOThBM0QifQ.xSfnO21PsmCPgLkE34wZQ5mLOcRmb4NPiBSKw3EULCBZiVSWrR_VhddwMuyydBwkimA04f2NJQofD3gF3t5tuAE";

describe("eidas test suite", () => {
  describe("eidas proof attributes test suite", () => {
    it("should validate EIDAS Proof Attributes", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod:
          DID_ENTITY + constants.DEFAULT_EIDAS_VERIFICATION_METHOD,
        jws: VID_JWT,
      };

      expect(() => validateEIDASProofAttributes(proof)).not.toThrow();
    });

    it("should throw Type error on no Proof Type", () => {
      expect.assertions(1);

      const proof = {
        type: "",
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod:
          DID_ENTITY + constants.DEFAULT_EIDAS_VERIFICATION_METHOD,
        jws: VID_JWT,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `Proof type is missing '${constants.DEFAULT_EIDAS_PROOF_TYPE}'`
      );
    });

    it("should throw Type error on Proof Type incorrect", () => {
      expect.assertions(1);

      const proof = {
        type: "test type",
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod:
          DID_ENTITY + constants.DEFAULT_EIDAS_VERIFICATION_METHOD,
        jws: VID_JWT,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `Proof type is missing '${constants.DEFAULT_EIDAS_PROOF_TYPE}'`
      );
    });

    it("should throw Type error on no Proof Purpose", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: "",
        verificationMethod:
          DID_ENTITY + constants.DEFAULT_EIDAS_VERIFICATION_METHOD,
        jws: VID_JWT,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `Proof Purpose is missing '${constants.DEFAULT_PROOF_PURPOSE}'`
      );
    });

    it("should throw Type error on Proof Purpose incorrect", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: "test proof",
        verificationMethod:
          DID_ENTITY + constants.DEFAULT_EIDAS_VERIFICATION_METHOD,
        jws: VID_JWT,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `Proof Purpose is missing '${constants.DEFAULT_PROOF_PURPOSE}'`
      );
    });

    it("should throw Type error on no Verification Method", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: "",
        jws: VID_JWT,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `EIDAS Verification Method key is missing '${constants.DEFAULT_EIDAS_VERIFICATION_METHOD}'`
      );
    });

    it("should throw Type error on incorrect Verification Method", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod: `${DID_ENTITY}#a verif test`,
        jws: VID_JWT,
      };

      expect(() => validateEIDASProofAttributes(proof as never)).toThrow(
        `EIDAS Verification Method key is missing '${constants.DEFAULT_EIDAS_VERIFICATION_METHOD}'`
      );
    });

    it("should throw Type error on incorrect Proof keys", () => {
      expect.assertions(1);

      const proof = {
        type: constants.DEFAULT_EIDAS_PROOF_TYPE,
        created: new Date().toISOString(),
        proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
        verificationMethod:
          DID_ENTITY + constants.DEFAULT_EIDAS_VERIFICATION_METHOD,
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
