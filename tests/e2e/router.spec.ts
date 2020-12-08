import request from "supertest";
import http from "http";
import { startEbsiService } from "../../src/api/app";
import { BRIDGE_SERVICE } from "../../src/config";
import { SignPayload } from "../../src/dtos/secureEnclave";
import { EIDASSignatureOutput } from "../../src/dtos/eidas";
import constants from "../../src/@types";

jest.setTimeout(100000);

describe("eidas-bridge router API calls", () => {
  let server: http.Server;
  const testPort = 9900;

  // eslint-disable-next-line jest/no-done-callback
  beforeAll(async (done) => {
    // launch Server to test its RESTful API
    server = await startEbsiService(
      BRIDGE_SERVICE.NAME.EIDAS,
      testPort,
      BRIDGE_SERVICE.SWAGGER_INTERNAL_URL.EIDAS
    );

    done();
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  it("responds 404 to /", async () => {
    expect.assertions(1);
    const res = await request(server).get("/");
    expect(res.status).toStrictEqual(404);
  });

  describe("secure enclave endpoints", () => {
    // !!! TODO: get the correct entityToken & entityDid
    const entityToken = "";
    const entityDid = "";
    it("returns a 400 without a body", async () => {
      expect.assertions(1);
      const res = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .set("Authorization", `Bearer ${entityToken}`);
      expect(res.status).toStrictEqual(400);
    });
    it("returns a 201 with a signature", async () => {
      expect.assertions(3);
      const signPayload: SignPayload = {
        issuer: entityDid,
        payload: { data: "data to be signed" },
        type: constants.SignatureTypes.EidasSeal2019,
      };
      const expectedResponse: EIDASSignatureOutput = {
        issuer: entityDid,
        proof: {
          type: signPayload.type,
          created: expect.any(String),
          proofPurpose: constants.DEFAULT_PROOF_PURPOSE,
          verificationMethod: `${entityDid}${constants.DEFAULT_EIDAS_VERIFICATION_METHOD}`,
          jws: expect.any(String),
        },
      };
      const res = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .set("Authorization", `Bearer ${entityToken}`)
        .send(signPayload);
      expect(res.status).toStrictEqual(201);
      expect(res.body).toMatchObject(expectedResponse);
      const { payload } = decodeJwt(res.body.proof.jws);
      const expectedSignature = {
        iat: expect.any(Number),
        iss: expect.stringContaining(`did:vid:`), // signer is another did from temporaly generated keys
        ...signPayload.payload,
      };
      expect(payload).toMatchObject(expectedSignature);
    });

    it("returns a 204 with a valid signature", async () => {
      expect.assertions(4);

      const signPayload: SignPayload = {
        issuer: entityDid,
        payload: { data: "data to be signed" },
        type: constants.SignatureTypes.EidasSeal2019,
      };
      const resSignature = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_CREATION}`
        )
        .set("Authorization", `Bearer ${entityToken}`)
        .send(signPayload);
      expect(resSignature.status).toStrictEqual(201);
      expect(resSignature.body).toHaveProperty("issuer");
      expect(resSignature.body).toHaveProperty("proof");

      const resSigValidation = await request(server)
        .post(
          `${BRIDGE_SERVICE.BASE_PATH.EIDAS}${BRIDGE_SERVICE.CALL.SIGNATURE_VALIDATION}`
        )
        .set("Authorization", `Bearer ${entityToken}`)
        .send({ proof: resSignature.body.proof });
      expect(resSigValidation.status).toStrictEqual(204);
    });
  });
});
