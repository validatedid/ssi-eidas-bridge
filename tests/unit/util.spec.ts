import { JWK } from "jose";
import * as util from "util";
import LOGGER from "../../src/logger";
import {
  PRINT_SILLY,
  generateKeys,
  toHex,
  pemtohex,
  PRINT_INFO,
  PRINT_DEBUG,
  PRINT_ERROR,
  prefixWith0x,
  getDidFromPemPubKey,
} from "../../src/utils/util";

describe("utils Test Suite", () => {
  it("should create a JWK key pair", () => {
    expect.assertions(2);
    const key = generateKeys();
    expect(key).toBeDefined();
    expect(JWK.isKey(key)).toBe(true);
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
    it("should call LOGGER.log with info parameter", () => {
      expect.assertions(1);
      const data = { toPrint: "some random data" };
      const operation = "test operation";
      const mockLog = jest.spyOn(LOGGER, "log").mockImplementation();
      PRINT_INFO(data, operation);
      expect(mockLog).toHaveBeenCalledWith({
        message: util.inspect(data),
        level: "info",
        operation,
      });
      mockLog.mockRestore();
    });

    it("should call LOGGER.log with debug parameter", () => {
      expect.assertions(1);
      const data = { toPrint: "some random data" };
      const operation = "test operation";
      const mockLog = jest.spyOn(LOGGER, "log").mockImplementation();
      PRINT_DEBUG(data, operation);
      expect(mockLog).toHaveBeenCalledWith({
        message: util.inspect(data),
        level: "debug",
        operation,
      });
      mockLog.mockRestore();
    });

    it("should call LOGGER.log with silly parameter passing a string", () => {
      expect.assertions(1);
      const data = "i am a string";
      const operation = "test operation";
      const mockLog = jest.spyOn(LOGGER, "log").mockImplementation();
      PRINT_SILLY(data, operation);
      expect(mockLog).toHaveBeenCalledWith({
        message: `\n${data}`,
        level: "silly",
        operation,
      });
      mockLog.mockRestore();
    });

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

describe("did key tests should", () => {
  it("code a base58 from a PEM public key", () => {
    expect.assertions(1);
    const pemPubKey = `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAozBgrSHFrezwbDULQCFP
    nlY+JRvjA+2EzKzEkYrk1O5PUQNNxVg9TphCWHtgFjn4+LUF1JLCzLPUAlj2dIBX
    3gvo5Ul392OHMVuwvFiwDgLdjn0F1S1GOic72TQDezvC7eenus++jm2jX7GCh368
    t4uPVJVjue6s4Dy1aZ/2KtN6DUX22lC6BGF9OqHMHQgSStQsyUS1stbx/OcMNPsc
    QofEWCrli0qZoxv5VzMGPEHWDL0O6SX+Ivo7E8eEqnVQ3/TYDWTtwLTTE5O5G4gL
    G6i5lDlxg+a4e8FR3nFHKiWn/oDUR7AWxLOSCZ6h02+iAcvVA6MDFJiJmuVgw5Wz
    hlIxCEbNw0yHemujL0rpQHugHtgJHdKqmUjrbgpuhjzaG7KbYe5KI2+rnJkkKW+h
    MoVpCWkuC86MmQpmnhFhfqIz3pb1I5KFqfo3RIxFyu6PouyuNvPJYbBxlnP71gbe
    PnZ5jeY7nQwLbXk1REBnm4Q/ct6ODgouCkcGqROSsTzqVzLsVTZSsY7Zk/XqiQqe
    7DNgdjWsaajvjRjdjrk1jCzLRJXdVF6OcwtdK6Rg+1KvPq6XGt0Y0uzOU5IOZafP
    hb+mZl+C0bJ1wEtd6kZkZ9GMtHBYkcVOr/5Lili93jbrjDHd9JENY/4T9Wp/vPlN
    ja23PNpBMMC69GrIF1ozI6MCAwEAAQ==
    -----END PUBLIC KEY-----`;

    const did = getDidFromPemPubKey(pemPubKey);
    expect(did).toStrictEqual(
      "did:key:zUeppJKaohp7cU8Y6MT2aScYEKz1471mJE749vvzUSJRH8KMVYvV46M8717potFLDymcLvAZtvVWF8hWo35fHpzCLfkD8noNXsQkrwTbGAZaafN37io2TESpR9d9Nk4XgU3V7BzxMP7b33FqKK2iojQ5mHTSVbd34Tcbtf6rFTpsy8aD7No6saPwcK8JfK5GNfyHy3wBEvCkLxq1DqVH2bdoVGoqARcY6EKf6dSvn8oAfwyeQPL1qYz5DJhk9cKbTyGXZgEKrWgWG1n2Veky3C4avMQgxizfqZkxpUGtqUWrGV14Uxx2YGh8c6aBTjJGFXRsnw5thtxEUfVVdWPT9Va5kL6RPmWZ83edGUCkdzk1kaSVrsbP1HmV76c5ZnW3evL3AMXZUXqcSwBp4afUkF7Cn5vayeXdWpXD3EmJpzwUfJ6FFX8EkT9FjPUEsbMaA13ymqpbrZjN18tNCU1aPmGNe914Dnxhg6NtMthb4gHu2qx77moZojjGsbA9tvACgDmLWmetpBS2sy4NsbWSWdY2sW4W2Bc37QQpMyZcREarkcwASmuKfKrZJcDfSCEtBwcermmxRB6DUyVHTq667sSWSUH9xJMMntqe49ngTCmqcQugqPYtescERuWRu1Vudk4hXjSxF5iNE6Zhkf9iSn4S5Rnw7GoQJbf8vcT6tVixn81u97nLoa4ysewQDkD4yWvRa72A4VMnefqko6qGSHXfpCZpJdPNKDhLsLy81kM3k9kUrqj6"
    );
  });
});
