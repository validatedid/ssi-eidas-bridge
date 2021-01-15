import LOGGER from "../../src/logger";
import {
  generateKeys,
  toHex,
  pemtohex,
  PRINT_ERROR,
  prefixWith0x,
} from "../../src/utils/util";

describe("utils Test Suite", () => {
  it("should create a JWK key pair", () => {
    expect.assertions(3);
    const key = generateKeys();
    expect(key).toBeDefined();
    expect(key.privateKey).toBeDefined();
    expect(key.publicKey).toBeDefined();
  });

  it("should return an hex string encoded in base64", () => {
    expect.assertions(1);
    const input =
      "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAELyirt1/9cnZmMwV6V73HHmh8OHWcgNBUf/E4Os8cT2Uf+R3lW9hCiPm37f9ojCqoerhoGfoMgiNJIRhK+rDUfQ==";
    const expectedResult =
      "3056301006072a8648ce3d020106052b8104000a034200042f28abb75ffd72766633057a57bdc71e687c38759c80d0547ff1383acf1c4f651ff91de55bd84288f9b7edff688c2aa87ab86819fa0c82234921184afab0d47d";
    const result = toHex(input);
    expect(result).toMatch(expectedResult);
  });

  describe("print util functions suite", () => {
    it("should call LOGGER.log", () => {
      expect.assertions(1);
      const error = {
        name: "HTTPError",
        Title: "error title",
        Status: 500,
        Detail: "error detail",
        message: "error message",
      };
      const operation = "test operation";
      const mockError = jest.spyOn(LOGGER, "error").mockImplementation();
      PRINT_ERROR(error, operation);
      expect(mockError).toHaveBeenCalledTimes(2);
      mockError.mockRestore();
    });

    it("should call LOGGER.log nonhttp", () => {
      expect.assertions(1);
      const error = {
        name: "other error",
        message: "error message",
      };
      const operation = "test operation";
      const mockError = jest.spyOn(LOGGER, "error").mockImplementation();
      PRINT_ERROR(error, operation);
      expect(mockError).toHaveBeenCalledTimes(2);
      mockError.mockRestore();
    });

    it("should call LOGGER.log with a non HTTPError with stack and response", () => {
      expect.assertions(1);
      const error = {
        name: "other error",
        message: "error message",
        response: "error response",
        stack: "error stack",
      };
      const operation = "test operation";
      const mockError = jest.spyOn(LOGGER, "error").mockImplementation();
      PRINT_ERROR(error, operation);
      expect(mockError).toHaveBeenCalledTimes(4);
      mockError.mockRestore();
    });

    it("should prefix the keys with 0x if they don't start with 0x", () => {
      expect.assertions(1);
      expect(prefixWith0x("fakekey")).toStrictEqual("0xfakekey");
    });

    it("should not prefix the keys with 0x if they already start with 0x", () => {
      expect.assertions(1);
      expect(prefixWith0x("0xfakekey")).toStrictEqual("0xfakekey");
    });
  });
});

describe("pemtohex tests should", () => {
  it("convert a pem to a hex string", () => {
    expect.assertions(1);
    expect(
      pemtohex(
        `-----BEGIN CMS-----
    MIIB+gYJKoZIhvcNAQcCoIIB6zCCAecCAQExDzANBglghkgBZQMEAgEFADAYBgkq
    hkiG9w0BBwGgCwQJanNyc2FzaWduMYIBtTCCAbECAQEwHzAaMQswCQYDVQQGEwJV
    UzELMAkGA1UECgwCWjQCAQEwDQYJYIZIAWUDBAIBBQCgaTAYBgkqhkiG9w0BCQMx
    CwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xMzEyMzEyMzU5NTlaMC8GCSqG
    SIb3DQEJBDEiBCCEwk3R2fVus6B65KI0Ra3U+suu14yJR1KWq3lUKE2c1DANBgkq
    hkiG9w0BAQsFAASCAQAuECknpVfs73lvw2tdhYIH6TknNDNh/lE2zjTmRTR3Zaxd
    4xYZCtV7yWv9/zTXgpx8tigEcKMsOjllFJrtnxAy+dT5LOy1A4wZtvCw+JTnMOE4
    zy9afOHyOVNbgpl3zhrUsvzyJpU+3sqr9qW3/NF5pea9G0TB8QE0GkrDj30tCGwt
    AMw8atf7B1Jc98t2ZCDl9ijDbdrvtwhwFmajAbyPG5wkyg5Qv0YmZI0Vssnu4bh0
    U/Fcon8+BYAJWUeli8w/9oW3xMLO2zrv53qH2O1X6rIqCCIg6QkIjPsY+VHGWpzT
    khP5p+OoGxO2E38Cg9qZ4DAqnCcjgJnjHLVlbjIA
    -----END CMS-----`,
        "CMS"
      )
    ).toStrictEqual(
      "308201fa06092a864886f70d010702a08201eb308201e7020101310f300d06096086480165030402010500301806092a864886f70d010701a00b04096a737273617369676e318201b5308201b1020101301f301a310b3009060355040613025553310b3009060355040a0c025a34020101300d06096086480165030402010500a069301806092a864886f70d010903310b06092a864886f70d010701301c06092a864886f70d010905310f170d3133313233313233353935395a302f06092a864886f70d0109043122042084c24dd1d9f56eb3a07ae4a23445add4facbaed78c89475296ab7954284d9cd4300d06092a864886f70d01010b0500048201002e102927a557ecef796fc36b5d858207e93927343361fe5136ce34e645347765ac5de316190ad57bc96bfdff34d7829c7cb6280470a32c3a3965149aed9f1032f9d4f92cecb5038c19b6f0b0f894e730e138cf2f5a7ce1f239535b829977ce1ad4b2fcf226953edecaabf6a5b7fcd179a5e6bd1b44c1f101341a4ac38f7d2d086c2d00cc3c6ad7fb07525cf7cb766420e5f628c36ddaefb708701666a301bc8f1b9c24ca0e50bf4626648d15b2c9eee1b87453f15ca27f3e0580095947a58bcc3ff685b7c4c2cedb3aefe77a87d8ed57eab22a082220e909088cfb18f951c65a9cd39213f9a7e3a81b13b6137f0283da99e0302a9c27238099e31cb5656e3200"
    );
  });
});
