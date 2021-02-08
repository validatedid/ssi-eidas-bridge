import { indication } from "../../src/dtos";
import { ApiErrorMessages, BadRequestError } from "../../src/errors";
import {
  canonizeCredential,
  getKidFromDidAndPemCertificate,
} from "../../src/utils/ssi";
import * as mockedData from "../data/credentials";
import { generateDid, resolveDid } from "../utils";

describe("ssi util tests should", () => {
  it("build a kid", () => {
    expect.assertions(1);
    const pemCertificate = `-----BEGIN CERTIFICATE-----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-----END CERTIFICATE-----`;
    const did = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";
    const expectedResult =
      "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvcPOS736aX2tfwEj+mMCJ3kw6KBCDHLRNqtkDseXNTuhdIs5Uj7wPcOETexT1DnGDfPZ3HYBsc8x8jWKFtO/E5oqFzXDyq60G8Qmlt509JKQJLP0YxrXwjZcLD/uM9Qf8lCjjiVJjDYnztE88p5jkQ2V9HCf3NK3ASL3m2q4M5QRHNGiTTvCvcRG2qRocVIp3EB8fwIpgqWxi6uI242yE7E1J4fVDXlD4hYpocDH0HOzazQXrNubHz6EGkOt5nAKeEzToqE9ow++h6TRHhfmdWJFb2HQ7FvoAMUYopQJaKpk/V5FpmXTDyMPNt2uj9UBS/EML7Z3vXzXUUJq/pTbdtJIpZaZk0SOCdt3iWk8CCNIHAHdN0uy+SWC+AH0hv56urQqR0Zaz33fGguhbuUYKzXt1CTQgCTkEhcwT9Sml4m1WGMl3fbFMFkacPGRwSMs5ZXKjDCRdz+N8/pFExOuobCqIMUPGC98TVsV3drrsSe716CSHS3BWuaum/W3ve5w1Z11nGbRih9X5AuYg5t/gwFDsg05iQa76ymzWSaZEEL5btHvCXNsmsyDU1n/KJw4S8nnXj+qt+xLNENNWsijcP7VnE1bkXvEQ0rg/PewmPWKVLIHZf5s8RJTmAdCFE0IJT1WiXufwT9QUa6BfyE1mOpnk4LpwkhcmM0jNADHvp8CAwEAAQ==";
    const result = getKidFromDidAndPemCertificate({
      did,
      pemCertificate,
    });
    expect(result).toStrictEqual(expectedResult);
  });

  it("generate a key did with a passed seed", async () => {
    expect.assertions(1);
    const seed = new Uint8Array(32);
    const result = await generateDid(seed);
    expect(result).toStrictEqual(
      "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    );
  });

  it("generate a key did with no passed seed", async () => {
    expect.assertions(2);
    const result = await generateDid();
    expect(result).toContain("did:key:z6Mk");
    expect(result).toHaveLength(56);
  });

  it("resolves a specific did", async () => {
    expect.assertions(1);
    const expectedDidDoc = {
      didDocument: {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          {
            "@base": "did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
          },
        ],
        assertionMethod: ["#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP"],
        authentication: ["#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP"],
        capabilityDelegation: [
          "#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
        ],
        capabilityInvocation: [
          "#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
        ],
        id: "did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
        keyAgreement: ["#z6LScqmY9kirLuY22G6CuqBjuMpoqtgWk7bahWjuxFw5xH6G"],
        verificationMethod: [
          {
            controller:
              "did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
            id: "#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
            publicKeyBase58: "dbDmZLTWuEYYZNHFLKLoRkEX4sZykkSLNQLXvMUyMB1",
            type: "Ed25519VerificationKey2018",
          },
          {
            controller:
              "did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP",
            id: "#z6LScqmY9kirLuY22G6CuqBjuMpoqtgWk7bahWjuxFw5xH6G",
            publicKeyBase58: "2AbNdSuzFSpGvsiSPBfnamcKzk9Q3WRRpY2EToHZEuKW",
            type: "X25519KeyAgreementKey2019",
          },
        ],
      },
      didDocumentMetaData: { "content-type": "application/did+ld+json" },
      didResolutionMetaData: {},
    };
    const result = await resolveDid(
      "did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP"
    );
    expect(result).toMatchObject(expectedDidDoc);
  });

  it("resolves a new did", async () => {
    expect.assertions(1);
    const did = await generateDid();
    const kid = did.replace("did:key:", "");
    const expectedDidDoc = {
      didDocument: {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          {
            "@base": did,
          },
        ],
        assertionMethod: [`#${kid}`],
        authentication: [`#${kid}`],
        capabilityDelegation: [`#${kid}`],
        capabilityInvocation: [`#${kid}`],
        id: did,
        keyAgreement: [expect.any(String)],
        verificationMethod: [
          {
            controller: did,
            id: `#${kid}`,
            publicKeyBase58: expect.any(String) as string,
            type: "Ed25519VerificationKey2018",
          },
          {
            controller: did,
            id: expect.any(String) as string,
            publicKeyBase58: expect.any(String) as string,
            type: "X25519KeyAgreementKey2019",
          },
        ],
      },
      didDocumentMetaData: { "content-type": "application/did+ld+json" },
      didResolutionMetaData: {},
    };
    const result = await resolveDid(did);
    expect(result).toMatchObject(expectedDidDoc);
  });

  it("canonize a given verifiable credential with context", async () => {
    expect.assertions(1);
    const canonized = await canonizeCredential(mockedData.mockVC);
    expect(canonized).toMatchInlineSnapshot(`
      "<did:example:ebfeb1f712ebc6f1c276e12ec21> <https://example.org/examples#degree> _:c14n0 .
      <http://example.gov/credentials/3732> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://example.org/examples#UniversityDegreeCredential> .
      <http://example.gov/credentials/3732> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .
      <http://example.gov/credentials/3732> <https://w3id.org/security#proof> _:c14n1 .
      <http://example.gov/credentials/3732> <https://www.w3.org/2018/credentials#credentialSubject> <did:example:ebfeb1f712ebc6f1c276e12ec21> .
      <http://example.gov/credentials/3732> <https://www.w3.org/2018/credentials#issuanceDate> \\"2010-01-01T19:73:24Z\\"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
      <http://example.gov/credentials/3732> <https://www.w3.org/2018/credentials#issuer> <https://example.edu> .
      _:c14n0 <http://schema.org/name> \\"Bachelor of Science and Arts\\"^^<http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML> .
      _:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://example.org/examples#BachelorDegree> .
      _:c14n2 <http://purl.org/dc/terms/created> \\"2018-06-18T21:19:10Z\\"^^<http://www.w3.org/2001/XMLSchema#dateTime> _:c14n1 .
      _:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#RsaSignature2018> _:c14n1 .
      _:c14n2 <sec:jws> \\"eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..DJBMvvFAIC00nSGB6Tn0XKbbF9XrsaJZREWvR2aONYTQQxnyXirtXnlewJMBBn2h9hfcGZrvnC1b6PgWmukzFJ1IiH1dWgnDIS81BH-IxXnPkbuYDeySorc4QU9MJxdVkY5EL4HYbcIfwKj6X4LBQ2_ZHZIu1jdqLcRZqHcsDF5KKylKc1THn5VRWy5WhYg_gBnyWny8E6Qkrze53MR7OuAmmNJ1m1nN8SxDrG6a08L78J0-Fbas5OjAQz3c17GY8mVuDPOBIOVjMEghBlgl3nOi1ysxbRGhHLEK4s0KKbeRogZdgt1DkQxDFxxn41QWDw_mmMCjs9qxg0zcZzqEJw\\" _:c14n1 .
      _:c14n2 <sec:proofPurpose> <https://w3id.org/security#assertionMethod> _:c14n1 .
      _:c14n2 <sec:verificationMethod> <https://example.com/jdoe/keys/1> _:c14n1 .
      "
    `);
  }, 30000);
  it("throw BadRequestError when canonize a non Credential", async () => {
    expect.assertions(1);
    const expectedError = new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: ApiErrorMessages.CANONIZE_BAD_PARAMS,
    });
    await expect(canonizeCredential({ data: "some data" })).rejects.toThrow(
      expectedError
    );
  });
});
