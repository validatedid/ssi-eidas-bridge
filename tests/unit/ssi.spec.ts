import {
  calculateLdProofHashforVerification,
  canonizeCredential,
  canonizeProofOptions,
  getKidFromDidAndPemCertificate,
} from "../../src/utils/ssi";
import * as mockedData from "../data/credentials";

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

  it("canonize a proofOption", async () => {
    const canonized = await canonizeProofOptions(
      mockedData.offblocksVerifiableCredential,
      mockedData.proof
    );
    expect(canonized.length).toBeGreaterThan(0);
    expect(canonized)
      .toMatch(`_:c14n0 <http://purl.org/dc/terms/created> "2021-03-05T12:07:47Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#CAdESRSASignature2020> .
_:c14n0 <https://w3id.org/security#creator> "did:key:z6Mko3ZSkBCqcFJpdxWqFhCHSuDoKnMVQFg9xip6htu6u4Xj" .
_:c14n0 <https://w3id.org/security#proofPurpose> <https://w3id.org/security#assertionMethod> .
_:c14n0 <https://w3id.org/security#verificationMethod> <did:key:z6Mko3ZSkBCqcFJpdxWqFhCHSuDoKnMVQFg9xip6htu6u4Xj#eidas-key> .
`);
  });

  it("calculate LD Proof hash for signature verification", async () => {
    const credential = mockedData.offblocksVerifiableCredential;
    const { proof } = credential;

    const expectedResult =
      "MWVUt3Lz5TdjYAqund/b3FqaSLYDkB6cA08KVM02M7kx6p9Bh8utllQ+b6nH6txElo/yDen7GWKt3eZsFOqVQw==";

    const concatenatedHashes = await calculateLdProofHashforVerification(
      credential,
      proof
    );

    expect(concatenatedHashes.toString("base64")).toMatch(expectedResult);
  }, 30000);
});
