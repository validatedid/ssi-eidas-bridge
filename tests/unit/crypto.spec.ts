import fs from "fs";
import path from "path";
import { eidasCrypto } from "../../src/utils";

describe("eidas crypto tests should", () => {
  const testFilePath = "../data/validatedid/";
  const p12File = "keyStore.p12";
  const fileData = fs.readFileSync(
    path.join(__dirname, `${testFilePath}${p12File}`),
    "hex"
  );

  it("parse a P12 file with a self-signed cert", () => {
    expect.assertions(1);

    const result = eidasCrypto.parseP12File(
      Buffer.from(fileData, "hex"),
      "vidchain"
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "pemCert": Array [
          "-----BEGIN CERTIFICATE-----
      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
      uVJYSyDHuWdV
      -----END CERTIFICATE-----
      ",
        ],
        "pemPrivateKey": "-----BEGIN RSA PRIVATE KEY-----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-----END RSA PRIVATE KEY-----",
      }
    `);
  });
  it("return a PEM public key from a certificate", () => {
    expect.assertions(1);
    const { pemCert } = eidasCrypto.parseP12File(
      Buffer.from(fileData, "hex"),
      "vidchain"
    );
    const publicKey = eidasCrypto.getPemPublicKeyfromPemCert(pemCert[0]);
    expect(publicKey).toMatchInlineSnapshot(`
      "-----BEGIN PUBLIC KEY-----
      MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtqkBgqlhyCSjyCbPekPC
      ip0ATf3n6reiEOmYOHcbnjfupMHsavWkgHdBwj2i7rN3JGBG0dQw8zHBrwiBnzHT
      oSQeRNluVEBVTNUJwAyK9GZ8APrj+AThASe0Yh/WKpfAULSI3Z0x4cMhquaKF5Ob
      bKyzwF1hq2mzodErZaMIMONUO51IId3+WJ//Ot4pEkvyr0CZVrR2tTOxCYnh31Kb
      dUM3rVOKkuPTUZ6Ll2FZ0m2hWNxlKIxXDT+oBZKYFB+2idsr00XoUcPBhcGLlaFe
      8fDLgQfHo480x7YO8fbWpKIS4AORh89Tti+uC+nh6o7goYDRTTk1c+kw3xNnBIzs
      2K5ap3w0ns6DTBF8RcP1oXAJl5uKcL/TV85wEguAed5UO0yQUZm5JrELyoZb78dR
      i0rUSRuINL7Dwr5yacLGcCsyBrVJ+RoXAv4BMTUPcVY0Vu73O4AJpSDGU9MPq4eL
      TmnJMEj2o+LB2w4gxft0fWLeQr2hG3WumhQRaNuK1kK0s3IGET5kLd1JGdoMgAr1
      YT+rsBXEY55MgY1ClrLhOvSVORQyJL1vG5cdJq9KornHmsXmvJKIl5rWkF0OlH1E
      Wj1G5Kpmn2YJ/mvXfIqMK+DkY8CTRAaqnV7lZiOEFo5rcImgtKfQmF1npo5Z6yl6
      Iwc7d0AQZGKjks+yLF+IOHUCAwEAAQ==
      -----END PUBLIC KEY-----
      "
    `);
  });
});
