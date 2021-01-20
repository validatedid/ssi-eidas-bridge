import { SignatureTypes } from "../../src/@types/constants";
import Controller from "../../src/api/eidas/controller";
import * as mockedData from "../data/credentials";
import { SignPayload } from "../../src/dtos/secureEnclave";
import * as eidas from "../../src/libs/eidas/eidas";
import { EidasProof } from "../../src/dtos/eidas";
import redis from "../../src/libs/storage/redis";

jest.mock("did-jwt", () => ({
  decodeJWT: jest.fn(),
}));

describe("controller suite tests", () => {
  afterAll(async () => {
    await redis.quit();
  });
  describe("eidas signature calls", () => {
    it("should throw an error when undefined signPayload", async () => {
      expect.assertions(1);
      await expect(
        Controller.EIDASsignature(undefined as never)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error when empty signPayload", async () => {
      expect.assertions(1);
      const signPayload = {};
      await expect(
        Controller.EIDASsignature(signPayload as never)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error when signPayload missing attributes", async () => {
      expect.assertions(3);
      const signPayloadIss = {
        issuer: "did:vid",
      };
      await expect(
        Controller.EIDASsignature(signPayloadIss as never)
      ).rejects.toThrow("Bad Request");
      const signPayloadIssPayload = {
        issuer: "did:vid",
        payload: {},
      };
      await expect(
        Controller.EIDASsignature(signPayloadIssPayload as never)
      ).rejects.toThrow("Bad Request");
      const signPayloadIssType = {
        issuer: "did:vid",
        type: "test",
      };
      await expect(
        Controller.EIDASsignature(signPayloadIssType as never)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error when signPayload signEidas no password", async () => {
      expect.assertions(1);
      const signPayload = {
        issuer: "did:vid",
        payload: {},
        type: "test",
      };
      await expect(
        Controller.EIDASsignature(signPayload as never)
      ).rejects.toThrow("Bad Request");
    });

    it("should return a value", async () => {
      expect.assertions(1);
      const did = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";
      const password = "vidchain";
      const signPayload: SignPayload = {
        issuer: did,
        payload: mockedData.mockCredential,
        password,
      };
      jest.spyOn(eidas, "signEidas").mockResolvedValue({} as EidasProof);
      const response = await Controller.EIDASsignature(signPayload);
      const expectedResponse = {
        ...mockedData.mockCredential,
        proof: {},
      };
      expect(response).toMatchObject(expectedResponse);
      jest.resetAllMocks();
    });
  });
  describe("eidas verification calls", () => {
    it("should throw an error when undefined vc", async () => {
      expect.assertions(1);
      await expect(
        Controller.EIDASvalidateSignature(undefined as never)
      ).rejects.toThrow(
        "Cannot use 'in' operator to search for '@context' in undefined"
      );
    });

    it("should throw an error when empty vc", async () => {
      expect.assertions(1);
      const vc = {};
      await expect(
        Controller.EIDASvalidateSignature(vc as never)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error when is not a vc", async () => {
      expect.assertions(1);
      const proof = {
        type: SignatureTypes.EidasSeal2019,
      };
      await expect(
        Controller.EIDASvalidateSignature(proof as never)
      ).rejects.toThrow("Bad Request");
    });

    it("should throw an error when vc proof is not valid eidasProof", async () => {
      expect.assertions(1);
      await expect(
        Controller.EIDASvalidateSignature(mockedData.mockVC as never)
      ).rejects.toThrow(
        "Verification Credential does not contain an Eidas Proof"
      );
    });
  });
});
