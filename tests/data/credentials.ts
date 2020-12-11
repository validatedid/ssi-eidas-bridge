export const mockVerifiableCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://example.edu/credentials/58473",
  type: ["VerifiableCredential", "AlumniCredential"],
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    alumniOf: {
      id: "did:example:c276e12ec21ebfeb1f712ebc6f1",
      name: [
        {
          value: "Example University",
          lang: "en",
        },
        {
          value: "Exemple d'Université",
          lang: "fr",
        },
      ],
    },
  },
  proof: {
    type: "RsaSignature2018",
    created: "2018-06-18T21:19:10Z",
    proofPurpose: "assertionMethod",
    verificationMethod: "https://example.com/jdoe/keys/1",
    jws: "",
  },
};

export const mockSimpleVC = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  id: "http://example.gov/credentials/3732",
};

export const mockVC = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://example.gov/credentials/3732",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  issuer: "https://example.edu",
  issuanceDate: "2010-01-01T19:73:24Z",
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science and Arts",
    },
  },
  proof: {
    type: "RsaSignature2018",
    created: "2018-06-18T21:19:10Z",
    proofPurpose: "assertionMethod",
    verificationMethod: "https://example.com/jdoe/keys/1",
    jws: `eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..DJBMvvFAIC00nSGB6Tn0XKbbF9XrsaJZREWvR2aONYTQQxnyXirtXnlewJMBBn2h9hfcGZrvnC1b6PgWmukzFJ1IiH1dWgnDIS81BH-IxXnPkbuYDeySorc4QU9MJxdVkY5EL4HYbcIfwKj6X4LBQ2_ZHZIu1jdqLcRZqHcsDF5KKylKc1THn5VRWy5WhYg_gBnyWny8E6Qkrze53MR7OuAmmNJ1m1nN8SxDrG6a08L78J0-Fbas5OjAQz3c17GY8mVuDPOBIOVjMEghBlgl3nOi1ysxbRGhHLEK4s0KKbeRogZdgt1DkQxDFxxn41QWDw_mmMCjs9qxg0zcZzqEJw`,
  },
};
