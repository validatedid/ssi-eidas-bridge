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
  ],
  id: "http://example.gov/credentials/3732",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  issuer: "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp",
  issuanceDate: "2010-01-01T19:73:24Z",
  credentialSubject: {
    id: "did:key:z6MknGc3ocHs3zdPiJbnaaqDi58NGb4pk1Sp9WxWufuXSdxf",
    degree: { type: "BachelorDegree", name: "Bachelor of Science and Arts" },
  },
  proof: {
    type: "CAdESRSASignature2020",
    created: "2020-12-11T13:21:30Z",
    proofPurpose: "assertionMethod",
    verificationMethod:
      "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvcPOS736aX2tfwEj+mMCJ3kw6KBCDHLRNqtkDseXNTuhdIs5Uj7wPcOETexT1DnGDfPZ3HYBsc8x8jWKFtO/E5oqFzXDyq60G8Qmlt509JKQJLP0YxrXwjZcLD/uM9Qf8lCjjiVJjDYnztE88p5jkQ2V9HCf3NK3ASL3m2q4M5QRHNGiTTvCvcRG2qRocVIp3EB8fwIpgqWxi6uI242yE7E1J4fVDXlD4hYpocDH0HOzazQXrNubHz6EGkOt5nAKeEzToqE9ow++h6TRHhfmdWJFb2HQ7FvoAMUYopQJaKpk/V5FpmXTDyMPNt2uj9UBS/EML7Z3vXzXUUJq/pTbdtJIpZaZk0SOCdt3iWk8CCNIHAHdN0uy+SWC+AH0hv56urQqR0Zaz33fGguhbuUYKzXt1CTQgCTkEhcwT9Sml4m1WGMl3fbFMFkacPGRwSMs5ZXKjDCRdz+N8/pFExOuobCqIMUPGC98TVsV3drrsSe716CSHS3BWuaum/W3ve5w1Z11nGbRih9X5AuYg5t/gwFDsg05iQa76ymzWSaZEEL5btHvCXNsmsyDU1n/KJw4S8nnXj+qt+xLNENNWsijcP7VnE1bkXvEQ0rg/PewmPWKVLIHZf5s8RJTmAdCFE0IJT1WiXufwT9QUa6BfyE1mOpnk4LpwkhcmM0jNADHvp8CAwEAAQ==",
    cades:
      "-----BEGIN PKCS7-----MIIPGQYJKoZIhvcNAQcCoIIPCjCCDwYCAQExDzANBglghkgBZQMEAgEFADCCBFAGCSqGSIb3DQEHAaCCBEEEggQ9PGRpZDprZXk6ejZNa25HYzNvY0hzM3pkUGlKYm5hYXFEaTU4TkdiNHBrMVNwOVd4V3VmdVhTZHhmPiA8aHR0cHM6Ly9leGFtcGxlLm9yZy9leGFtcGxlcyNkZWdyZWU+IF86YzE0bjAgLgo8aHR0cDovL2V4YW1wbGUuZ292L2NyZWRlbnRpYWxzLzM3MzI+IDxodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjdHlwZT4gPGh0dHBzOi8vZXhhbXBsZS5vcmcvZXhhbXBsZXMjVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWw+IC4KPGh0dHA6Ly9leGFtcGxlLmdvdi9jcmVkZW50aWFscy8zNzMyPiA8aHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zI3R5cGU+IDxodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscyNWZXJpZmlhYmxlQ3JlZGVudGlhbD4gLgo8aHR0cDovL2V4YW1wbGUuZ292L2NyZWRlbnRpYWxzLzM3MzI+IDxodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscyNjcmVkZW50aWFsU3ViamVjdD4gPGRpZDprZXk6ejZNa25HYzNvY0hzM3pkUGlKYm5hYXFEaTU4TkdiNHBrMVNwOVd4V3VmdVhTZHhmPiAuCjxodHRwOi8vZXhhbXBsZS5nb3YvY3JlZGVudGlhbHMvMzczMj4gPGh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzI2lzc3VhbmNlRGF0ZT4gIjIwMTAtMDEtMDFUMTk6NzM6MjRaIl5ePGh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hI2RhdGVUaW1lPiAuCjxodHRwOi8vZXhhbXBsZS5nb3YvY3JlZGVudGlhbHMvMzczMj4gPGh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzI2lzc3Vlcj4gPGRpZDprZXk6ejZNa2lUQnoxeW11ZXBBUTRIRUhZU0Yx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-----END PKCS7-----",
  },
};
