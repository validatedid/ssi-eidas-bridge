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

export const offblocksVerifiableCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://validatedid.github.io/jsonld-contexts/ades-signatures/v1/",
    // "https://essif-lab.pages.grnet.gr/interoperability/eidas-generic-use-case/contexts/cades-signature.jsonld",
  ],
  id: "http://example.gov/credentials/3732",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  issuer:
    "did:factom:testnet:ba7a64e48959a7d9fd76cb7cdd1c4b0f56be27407db2558964e670e48631915d",
  issuanceDate: "2020-03-10T04:24:12.164Z",
  credentialSubject: {
    id: "did:factom:5d0dd58757119dd437c70d92b44fbf86627ee275f0f2146c3d99e441da342d9f",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science and Arts",
    },
  },
  proof: {
    type: "CAdESRSASignature2020",
    created: "2021-03-08T14:01:42Z",
    verificationMethod:
      "did:factom:testnet:ba7a64e48959a7d9fd76cb7cdd1c4b0f56be27407db2558964e670e48631915d#eidas-key",
    proofPurpose: "assertionMethod",
    cades:
      "-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADCABgkqhkiG9w0B\nBwGggCSABEAxZVS3cvPlN2NgCq6d39vcWppItgOQHpwDTwpUzTYzuTHqn0GHy62W\nVD5vqcfq3ESWj/IN6fsZYq3d5mwU6pVDAAAAAAAAoIAwggeFMIIGbaADAgECAhBK\nco+mAJBghF+KrSdHscajMA0GCSqGSIb3DQEBCwUAMEcxCzAJBgNVBAYTAkVTMREw\nDwYDVQQKDAhGTk1ULVJDTTElMCMGA1UECwwcQUMgQ29tcG9uZW50ZXMgSW5mb3Jt\nw6F0aWNvczAeFw0yMDEwMTcwODM2NTVaFw0yMzEwMTcwODM2NTRaMIGgMQswCQYD\nVQQGEwJFUzEPMA0GA1UEBwwGTUFEUklEMRkwFwYDVQQKDBBGTk1ULVJDTSBQUlVF\nQkFTMQ4wDAYDVQQLDAVDRVJFUzESMBAGA1UEBRMJUTAwMDAwMDBKMRgwFgYDVQRh\nDA9WQVRFUy1RMDAwMDAwMEoxJzAlBgNVBAMMHlNFTExPIENPTVBPTkVOVEUgUFJV\nRUJBUyBFSURBUzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM4j4yWX\nm6nQISmSNM1Kne+N/TxgJRmPzBCGJf4XdH96WhulDXJ0K++Js5DrCW5Uk3H81gj3\nn6lg0NS/40NCM9YEeOyOZfrFu2wUYr7NYljjem3EV7orZlVxST05fkeseb3BHDmJ\nayqtBaPXxIGx2+Yux45dJ1kji3BbBZIEl34Jr93iOLmJUMqrOqsiAqQKXFq4o4yE\nZQZYbG7+js9GfMotL/Bb4BMuw6uNMiKGNyFhBgfBjYIvxN5Zy0kbBr801k+Ul7rq\n0s8awK4dqJHDcLQLfQ0Rd1bTATu9Ncwtq3yOuVcqCCl+EL3LRoi0jTkmGowyfSYO\nho55RP1EtGeocg8CAwEAAaOCBBEwggQNMAwGA1UdEwEB/wQCMAAwgYEGCCsGAQUF\nBwEBBHUwczA7BggrBgEFBQcwAYYvaHR0cDovL29jc3Bjb21wLmNlcnQuZm5tdC5l\ncy9vY3NwL09jc3BSZXNwb25kZXIwNAYIKwYBBQUHMAKGKGh0dHA6Ly93d3cuY2Vy\ndC5mbm10LmVzL2NlcnRzL0FDQ09NUC5jcnQwggE0BgNVHSAEggErMIIBJzCCARgG\nCisGAQQBrGYDCRMwggEIMCkGCCsGAQUFBwIBFh1odHRwOi8vd3d3LmNlcnQuZm5t\ndC5lcy9kcGNzLzCB2gYIKwYBBQUHAgIwgc0MgcpDZXJ0aWZpY2FkbyBjdWFsaWZp\nY2FkbyBkZSBzZWxsbyBlbGVjdHLDs25pY28gc2Vnw7puIHJlZ2xhbWVudG8gZXVy\nb3BlbyBlSURBUy4gU3VqZXRvIGEgbGFzIGNvbmRpY2lvbmVzIGRlIHVzbyBleHB1\nZXN0YXMgZW4gbGEgRFBDIGRlIEZOTVQtUkNNIGNvbiBOSUY6IFEyODI2MDA0LUog\nKEMvSm9yZ2UgSnVhbiAxMDYtMjgwMDktTWFkcmlkLUVzcGHDsWEpMAkGBwQAi+xA\nAQEwPAYDVR0RBDUwM6QxMC8xLTArBgkrBgEEAaxmAQgMHlNFTExPIENPTVBPTkVO\nVEUgUFJVRUJBUyBFSURBUzAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQw\nDgYDVR0PAQH/BAQDAgXgMB0GA1UdDgQWBBQv7tIRH+uNhu0BIY64efKwhBpWczCB\nsAYIKwYBBQUHAQMEgaMwgaAwCAYGBACORgEBMAsGBgQAjkYBAwIBDzATBgYEAI5G\nAQYwCQYHBACORgEGAjByBgYEAI5GAQUwaDAyFixodHRwczovL3d3dy5jZXJ0LmZu\nbXQuZXMvcGRzL1BEU19DT01QX2VzLnBkZhMCZXMwMhYsaHR0cHM6Ly93d3cuY2Vy\ndC5mbm10LmVzL3Bkcy9QRFNfQ09NUF9lbi5wZGYTAmVuMB8GA1UdIwQYMBaAFBn4\nWC8U1qbMmwSYCA1M16sAp4NlMIHgBgNVHR8EgdgwgdUwgdKggc+ggcyGgZ5sZGFw\nOi8vbGRhcGNvbXAuY2VydC5mbm10LmVzL0NOPUNSTDEsT1U9QUMlMjBDb21wb25l\nbnRlcyUyMEluZm9ybWF0aWNvcyxPPUZOTVQtUkNNLEM9RVM/Y2VydGlmaWNhdGVS\nZXZvY2F0aW9uTGlzdDtiaW5hcnk/YmFzZT9vYmplY3RjbGFzcz1jUkxEaXN0cmli\ndXRpb25Qb2ludIYpaHR0cDovL3d3dy5jZXJ0LmZubXQuZXMvY3Jsc2NvbXAvQ1JM\nMS5jcmwwDQYJKoZIhvcNAQELBQADggEBAAW4Yb3h18C01LoMFuicbYI9ZxltqfQc\nz5konRsl6+BvxG8ZJ2nR9bnzEmE2Xl6pziJYI6uz/jOmBtvwLdVFeH2C9Gw1PdcT\nVZAFPR9FvqCBPzgwO42uoQ5ynmCcnCu/5qRdl+8Seh1ky2Zo88Douv5BwlCZ4V++\nHIENUfQLRsIX3vh602XsH6iJnwS1tBR/2hucD3yi2ZWzshHsU15aDtYgJ9pLsWjV\n1KNK2Rdf2k5F9E4Hi2VfJJxz8WaqT6lDmWb18eTrYUPj3NXqIzu4X861+K1om2uu\n36vkz2QqApr5m8UzTRC5PdfcIslNMGuvF8tHz+ZbPx2y5jtT5XeCJZUAADGCAsEw\nggK9AgEBMFswRzELMAkGA1UEBhMCRVMxETAPBgNVBAoMCEZOTVQtUkNNMSUwIwYD\nVQQLDBxBQyBDb21wb25lbnRlcyBJbmZvcm3DoXRpY29zAhBKco+mAJBghF+KrSdH\nscajMA0GCWCGSAFlAwQCAQUAoIIBNzAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcB\nMBwGCSqGSIb3DQEJBTEPFw0yMTAzMDgxNDAxNDRaMC0GCSqGSIb3DQEJNDEgMB4w\nDQYJYIZIAWUDBAIBBQChDQYJKoZIhvcNAQELBQAwLwYJKoZIhvcNAQkEMSIEIGku\ni+zu4jcuUFTx/mOf30GT4lt+Fyfhf8hnWsy6GBhuMIGcBgsqhkiG9w0BCRACLzGB\njDCBiTCBhjCBgwQgiS/3WRqt0RDh7E6AqPY8irxvNvzisp8DGbrlqzp71vQwXzBL\npEkwRzELMAkGA1UEBhMCRVMxETAPBgNVBAoMCEZOTVQtUkNNMSUwIwYDVQQLDBxB\nQyBDb21wb25lbnRlcyBJbmZvcm3DoXRpY29zAhBKco+mAJBghF+KrSdHscajMA0G\nCSqGSIb3DQEBCwUABIIBAMEgYJ0u4P4SxeYXh3RZv7bjT6sK5Z7X5TwpGJdRd/6Y\nXehWV2BD9E69i6X4FwVKKEaGHm6pKz0LxKuIGQSImOG0xJ+fqoWlNuky9KlgX6jb\nnJbrSuCoBvMteWwmb1E2d2UOortnwWqQJxYQ5USOtURej8JjMW3441f1cuv+r0MA\nEUTfNGHkAcWcRBCh89vCCpwDQ9RV3gXRa82Z2kqfozURJyP1VbCaQ+P+FYN38L4b\nxW/RQDzujx0J7Hk5cxQpaFcFxav+xAeb8tnuQFp0//3cig9NawS73CLFPvzr5Vy3\nEVTJuEcTeAtRLuQf59BDJEdulxtHhtFpFpbYWGF6zqgAAAAAAAA=\n-----END PKCS7-----\n",
  },
};

export const proof = {
  type: "CAdESRSASignature2020",
  created: "2021-03-05T12:07:47Z",
  verificationMethod:
    "did:key:z6Mko3ZSkBCqcFJpdxWqFhCHSuDoKnMVQFg9xip6htu6u4Xj#eidas-key",
  creator: "did:key:z6Mko3ZSkBCqcFJpdxWqFhCHSuDoKnMVQFg9xip6htu6u4Xj",
  proofPurpose: "assertionMethod",
  cades:
    "-----BEGIN PKCS7-----\nMIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADCABgkqhkiG9w0B\nBwGggCSABEC45yxUXWK7sye4AEw94DM+0MDFEyY3aB2qz1bGI29vLtf8JalUvTPG\nv5PlPbjK/E7b50hTO3XDPRN6p9UioGxPAAAAAAAAoIAwggeFMIIGbaADAgECAhBK\nco+mAJBghF+KrSdHscajMA0GCSqGSIb3DQEBCwUAMEcxCzAJBgNVBAYTAkVTMREw\nDwYDVQQKDAhGTk1ULVJDTTElMCMGA1UECwwcQUMgQ29tcG9uZW50ZXMgSW5mb3Jt\nw6F0aWNvczAeFw0yMDEwMTcwODM2NTVaFw0yMzEwMTcwODM2NTRaMIGgMQswCQYD\nVQQGEwJFUzEPMA0GA1UEBwwGTUFEUklEMRkwFwYDVQQKDBBGTk1ULVJDTSBQUlVF\nQkFTMQ4wDAYDVQQLDAVDRVJFUzESMBAGA1UEBRMJUTAwMDAwMDBKMRgwFgYDVQRh\nDA9WQVRFUy1RMDAwMDAwMEoxJzAlBgNVBAMMHlNFTExPIENPTVBPTkVOVEUgUFJV\nRUJBUyBFSURBUzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM4j4yWX\nm6nQISmSNM1Kne+N/TxgJRmPzBCGJf4XdH96WhulDXJ0K++Js5DrCW5Uk3H81gj3\nn6lg0NS/40NCM9YEeOyOZfrFu2wUYr7NYljjem3EV7orZlVxST05fkeseb3BHDmJ\nayqtBaPXxIGx2+Yux45dJ1kji3BbBZIEl34Jr93iOLmJUMqrOqsiAqQKXFq4o4yE\nZQZYbG7+js9GfMotL/Bb4BMuw6uNMiKGNyFhBgfBjYIvxN5Zy0kbBr801k+Ul7rq\n0s8awK4dqJHDcLQLfQ0Rd1bTATu9Ncwtq3yOuVcqCCl+EL3LRoi0jTkmGowyfSYO\nho55RP1EtGeocg8CAwEAAaOCBBEwggQNMAwGA1UdEwEB/wQCMAAwgYEGCCsGAQUF\nBwEBBHUwczA7BggrBgEFBQcwAYYvaHR0cDovL29jc3Bjb21wLmNlcnQuZm5tdC5l\ncy9vY3NwL09jc3BSZXNwb25kZXIwNAYIKwYBBQUHMAKGKGh0dHA6Ly93d3cuY2Vy\ndC5mbm10LmVzL2NlcnRzL0FDQ09NUC5jcnQwggE0BgNVHSAEggErMIIBJzCCARgG\nCisGAQQBrGYDCRMwggEIMCkGCCsGAQUFBwIBFh1odHRwOi8vd3d3LmNlcnQuZm5t\ndC5lcy9kcGNzLzCB2gYIKwYBBQUHAgIwgc0MgcpDZXJ0aWZpY2FkbyBjdWFsaWZp\nY2FkbyBkZSBzZWxsbyBlbGVjdHLDs25pY28gc2Vnw7puIHJlZ2xhbWVudG8gZXVy\nb3BlbyBlSURBUy4gU3VqZXRvIGEgbGFzIGNvbmRpY2lvbmVzIGRlIHVzbyBleHB1\nZXN0YXMgZW4gbGEgRFBDIGRlIEZOTVQtUkNNIGNvbiBOSUY6IFEyODI2MDA0LUog\nKEMvSm9yZ2UgSnVhbiAxMDYtMjgwMDktTWFkcmlkLUVzcGHDsWEpMAkGBwQAi+xA\nAQEwPAYDVR0RBDUwM6QxMC8xLTArBgkrBgEEAaxmAQgMHlNFTExPIENPTVBPTkVO\nVEUgUFJVRUJBUyBFSURBUzAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQw\nDgYDVR0PAQH/BAQDAgXgMB0GA1UdDgQWBBQv7tIRH+uNhu0BIY64efKwhBpWczCB\nsAYIKwYBBQUHAQMEgaMwgaAwCAYGBACORgEBMAsGBgQAjkYBAwIBDzATBgYEAI5G\nAQYwCQYHBACORgEGAjByBgYEAI5GAQUwaDAyFixodHRwczovL3d3dy5jZXJ0LmZu\nbXQuZXMvcGRzL1BEU19DT01QX2VzLnBkZhMCZXMwMhYsaHR0cHM6Ly93d3cuY2Vy\ndC5mbm10LmVzL3Bkcy9QRFNfQ09NUF9lbi5wZGYTAmVuMB8GA1UdIwQYMBaAFBn4\nWC8U1qbMmwSYCA1M16sAp4NlMIHgBgNVHR8EgdgwgdUwgdKggc+ggcyGgZ5sZGFw\nOi8vbGRhcGNvbXAuY2VydC5mbm10LmVzL0NOPUNSTDEsT1U9QUMlMjBDb21wb25l\nbnRlcyUyMEluZm9ybWF0aWNvcyxPPUZOTVQtUkNNLEM9RVM/Y2VydGlmaWNhdGVS\nZXZvY2F0aW9uTGlzdDtiaW5hcnk/YmFzZT9vYmplY3RjbGFzcz1jUkxEaXN0cmli\ndXRpb25Qb2ludIYpaHR0cDovL3d3dy5jZXJ0LmZubXQuZXMvY3Jsc2NvbXAvQ1JM\nMS5jcmwwDQYJKoZIhvcNAQELBQADggEBAAW4Yb3h18C01LoMFuicbYI9ZxltqfQc\nz5konRsl6+BvxG8ZJ2nR9bnzEmE2Xl6pziJYI6uz/jOmBtvwLdVFeH2C9Gw1PdcT\nVZAFPR9FvqCBPzgwO42uoQ5ynmCcnCu/5qRdl+8Seh1ky2Zo88Douv5BwlCZ4V++\nHIENUfQLRsIX3vh602XsH6iJnwS1tBR/2hucD3yi2ZWzshHsU15aDtYgJ9pLsWjV\n1KNK2Rdf2k5F9E4Hi2VfJJxz8WaqT6lDmWb18eTrYUPj3NXqIzu4X861+K1om2uu\n36vkz2QqApr5m8UzTRC5PdfcIslNMGuvF8tHz+ZbPx2y5jtT5XeCJZUAADGCAsEw\nggK9AgEBMFswRzELMAkGA1UEBhMCRVMxETAPBgNVBAoMCEZOTVQtUkNNMSUwIwYD\nVQQLDBxBQyBDb21wb25lbnRlcyBJbmZvcm3DoXRpY29zAhBKco+mAJBghF+KrSdH\nscajMA0GCWCGSAFlAwQCAQUAoIIBNzAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcB\nMBwGCSqGSIb3DQEJBTEPFw0yMTAzMDUxMjA3NDhaMC0GCSqGSIb3DQEJNDEgMB4w\nDQYJYIZIAWUDBAIBBQChDQYJKoZIhvcNAQELBQAwLwYJKoZIhvcNAQkEMSIEIBNQ\nvRYCPV9+d8Gv+oeb4uDIeGyTuYNVGGBleo/wqRTIMIGcBgsqhkiG9w0BCRACLzGB\njDCBiTCBhjCBgwQgiS/3WRqt0RDh7E6AqPY8irxvNvzisp8DGbrlqzp71vQwXzBL\npEkwRzELMAkGA1UEBhMCRVMxETAPBgNVBAoMCEZOTVQtUkNNMSUwIwYDVQQLDBxB\nQyBDb21wb25lbnRlcyBJbmZvcm3DoXRpY29zAhBKco+mAJBghF+KrSdHscajMA0G\nCSqGSIb3DQEBCwUABIIBAE+5Z6Hhmr/dCVoADwK9M+VEGgMGKiwZbCMmyiMh656n\nClqjQS02OSzasWkRab3YSFVOkYP4rgdGUzn5G4ZbeINOyDrqd1u9f+3D2DHg4vW8\nUwemH554qEBlMpUKiphExKsiAxl/r/7UsPO9XUKVwXE39pZvJatm4Y3k6gRo4f/M\nEgxZ9OEM+RwG6l4mXqaKQGR652xMZWHOdovWpig4E34MSp60ZkYmRz6qpUJRycfz\nr5Em6L9PXuRRsNelVd3+wRPYeUXPgDV+8NK59YgczxNon2rC0c0wu3kP8QI6q2wn\n20aNatJ7Du+P+XWmUj0mtjXKX1NvSlham2/qR+85sVIAAAAAAAA=\n-----END PKCS7-----\n",
};

export const proofOptionsCades = {
  type: "CAdESRSASignature2020",
  created: "2021-03-03T07:29:00Z",
  verificationMethod:
    "did:key:z6MkjRZAGEtf7jweEAJpj1wdq5Ank8291woFYkirEz1JJz28#eidas-key",
  creator: "did:key:z6MkjRZAGEtf7jweEAJpj1wdq5Ank8291woFYkirEz1JJz28",
  proofPurpose: "assertionMethod",
  cades:
    "-----BEGIN PKCS7-----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-----END PKCS7-----",
};
