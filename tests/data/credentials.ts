export const mockVerifiableCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://example.edu/credentials/58473",
  type: ["VerifiableCredential", "AlumniCredential"],
  credentialSubject: {
    id: "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp",
    alumniOf: {
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
};

export const mockSimpleVC = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  id: "http://example.gov/credentials/3732",
};

export const mockCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://example.gov/credentials/3732",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  issuer: "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp",
  issuanceDate: "2010-01-01T19:73:24Z",
  credentialSubject: {
    id: "did:key:z6MknGc3ocHs3zdPiJbnaaqDi58NGb4pk1Sp9WxWufuXSdxf",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science and Arts",
    },
  },
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

export const eidasVerifiableCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://validatedid.github.io/jsonld-contexts/ades-signatures/v1/",
  ],
  id: "http://example.gov/credentials/3732",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  issuer: "did:key:z6MkmVTtS1RGoxyoGtB6HLMZAEVgYzwnUdD1VkojPj87hAP4",
  issuanceDate: "2010-01-01T19:24:24Z",
  credentialSubject: {
    id: "did:key:z6MknGc3ocHs3zdPiJbnaaqDi58NGb4pk1Sp9WxWufuXSdxf",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science and Arts",
    },
  },
  proof: {
    type: "CAdESRSASignature2020",
    created: "2021-02-26T16:21:23Z",
    proofPurpose: "assertionMethod",
    verificationMethod:
      "did:key:z6MkmVTtS1RGoxyoGtB6HLMZAEVgYzwnUdD1VkojPj87hAP4#MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAziPjJZebqdAhKZI0zUqd7439PGAlGY/MEIYl/hd0f3paG6UNcnQr74mzkOsJblSTcfzWCPefqWDQ1L/jQ0Iz1gR47I5l+sW7bBRivs1iWON6bcRXuitmVXFJPTl+R6x5vcEcOYlrKq0Fo9fEgbHb5i7Hjl0nWSOLcFsFkgSXfgmv3eI4uYlQyqs6qyICpApcWrijjIRlBlhsbv6Oz0Z8yi0v8FvgEy7Dq40yIoY3IWEGB8GNgi/E3lnLSRsGvzTWT5SXuurSzxrArh2okcNwtAt9DRF3VtMBO701zC2rfI65VyoIKX4QvctGiLSNOSYajDJ9Jg6GjnlE/US0Z6hyDwIDAQAB",
    cades:
      "-----BEGIN PKCS7-----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-----END PKCS7-----",
  },
};

export const offblocksVerifiableCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://example.gov/credentials/3732",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  issuer:
    "did:factom:5d0dd58757119dd437c70d92b44fbf86627ee275f0f2146c3d99e441da342d9f",
  issuanceDate: "2020-03-10T04:24:12.164Z",
  credentialSubject: {
    id:
      "did:factom:5d0dd58757119dd437c70d92b44fbf86627ee275f0f2146c3d99e441da342d9f",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science and Arts",
    },
  },
  proof: {
    type: "CAdESRSASignature2020",
    created: "2021-03-03T07:29:00Z",
    verificationMethod:
      "did:key:z6MkjRZAGEtf7jweEAJpj1wdq5Ank8291woFYkirEz1JJz28#eidas-key",
    creator: "did:key:z6MkjRZAGEtf7jweEAJpj1wdq5Ank8291woFYkirEz1JJz28",
    proofPurpose: "assertionMethod",
    cades:
      "-----BEGIN PKCS7-----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-----END PKCS7-----",
  },
};
