/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { JWK } from "jose";
import { KJUR, ASN1HEX } from "jsrsasign";
import { CadesSignatureInput, CadesSignatureOutput } from "../../dtos/cades";
/*
const generateKeys = (): JWK.RSAKey =>
  JWK.generateSync("RSA", 2048, { use: "sig" });
*/
const pemTestCertificate =
  "-----BEGIN CERTIFICATE-----MIIC/zCCAeegAwIBAgIBATANBgkqhkiG9w0BAQUFADAaMQswCQYDVQQGEwJVUzELMAkGA1UECgwCWjQwHhcNMTMwODI4MTgyODM0WhcNMjMwODI4MTgyODM0WjAaMQswCQYDVQQGEwJVUzELMAkGA1UECgwCWjQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDfdOqotHd55SYO0dLz2oXengw/tZ+q3ZmOPeVmMuOMIYO/Cv1wk2U0OK4pug4OBSJPhl09Zs6IwB8NwPOU7EDTgMOcQUYB/6QNCI1J7Zm2oLtuchzz4pIb+o4ZAhVprLhRyvqi8OTKQ7kfGfs5Tuwmn1M/0fQkfzMxADpjOKNgf0uy6lN6utjdTrPKKFUQNdc6/Ty8EeTnQEwUlsT2LAXCfEKxTn5RlRljDztS7Sfgs8VL0FPy1Qi8B+dFcgRYKFrcpsVaZ1lBmXKsXDRu5QR/Rg3f9DRq4GR1sNH8RLY9uApMl2SNz+sR4zRPG85R/se5Q06Gu0BUQ3UPm67ETVZLAgMBAAGjUDBOMB0GA1UdDgQWBBQHZPTEyQVu/0I/3QWhlTyW7WoTzTAfBgNVHSMEGDAWgBQHZPTEyQVu/0I/3QWhlTyW7WoTzTAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4IBAQDHxqJ9y8alTH7agVMWZfic/RbrdvHwyq+IOrgDToqyo0w+IZ6BCn9vjv5iuhqu4ForOWDAFpQKZW0DLBJEQy/7/0+9pk2DPhK1XzdOovlSrkRt+GcEpGnUXnzACXDBbO0+Wrk+hcjEkQRRK1bW2rknARIEJG9GS+pShP9Bq/0BmNsMepdNcBa0z3a5B0fzFyCQoUlX6RTqxRw1h1Qt5F00pfsp7SjXVIvYcewHaNASbto1n5hrSz1VY9hLba11ivL1N4WoWbmzAL6BWabsC2D/MenST2/X6hTKyGXpg3Eg2h3iLvUtwcNny0hRKstc73Jl9xR3qXfXKJH0ThTlq0gq-----END CERTIFICATE-----";
const pemTestPrivKey =
  "-----BEGIN PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDfdOqotHd55SYO0dLz2oXengw/tZ+q3ZmOPeVmMuOMIYO/Cv1wk2U0OK4pug4OBSJPhl09Zs6IwB8NwPOU7EDTgMOcQUYB/6QNCI1J7Zm2oLtuchzz4pIb+o4ZAhVprLhRyvqi8OTKQ7kfGfs5Tuwmn1M/0fQkfzMxADpjOKNgf0uy6lN6utjdTrPKKFUQNdc6/Ty8EeTnQEwUlsT2LAXCfEKxTn5RlRljDztS7Sfgs8VL0FPy1Qi8B+dFcgRYKFrcpsVaZ1lBmXKsXDRu5QR/Rg3f9DRq4GR1sNH8RLY9uApMl2SNz+sR4zRPG85R/se5Q06Gu0BUQ3UPm67ETVZLAgMBAAECggEADjU54mYvHpICXHjc5+JiFqiH8NkUgOG8LL4kwt3DeBp9bP0+5hSJH8vmzwJkeGG9L79EWG4b/bfxgYdeNX7cFFagmWPRFrlxbd64VRYFawZHRJt+2cbzMVI6DL8EK4bu5Ux5qTiV44Jw19hoD9nDzCTfPzSTSGrKD3iLPdnREYaIGDVxcjBv3Tx6rrv3Z2lhHHKhEHb0RRjATcjAVKV9NZhMajJ4l9pqJ3A4IQrCBl95ux6Xm1oXP0i6aR78cjchsCpcMXdP3WMsvHgTlsZT0RZLFHrvkiNHlPiil4G2/eHkwvT//CrcbO6SmI/zCtMmypuHJqcr+Xb7GPJoa64WoQKBgQDwrfelf3Rdfo9kaK/brBmbu1++qWpYVPTedQy84DK2p3GE7YfKyI+fhbnw5ol3W1jjfvZCmK/p6eZR4jgyJ0KJ76z53T8HoDTF+FTkR55oM3TEM46XzI36RppWP1vgcNHdz3U4DAqkMlAh4lVm3GiKPGX5JHHe7tWz/uZ55Kk58QKBgQDtrkqdSzWlOjvYD4mq4m8jPgS7v3hiHd+1OT8S37zdoT8VVzo2T4SF+fBhI2lWYzpQp2sCjLmCwK9k/Gur55H2kTBTwzlQ6WSLTe9Zj+eoMGklIirA+8YdQHXrO+CCw9BTJAF+c3c3xeUOLXafzyW29bASGfUtA7AxQAsR+Rr3+wKBgAwfZxrh6ZWP+17+WuVArOWIMZFj7SRX2yGdWa/lxwgmNPSSFkXjhkBttujoY8IsSrTivzqpgCrTCjPTpir4iURzWw4W08bpjd7u3C/HX7Y16Uq8ohEJT5lslveDJ3iNljSK74eMK7kLg7fBM7YDogxccHJ1IHsvInp3e1pmZxOxAoGAO+bSTUQ4N/UuQezgkF3TDrnBraO67leDGwRbfiE/U0ghQvqh5DA0QSPVzlWDZc9KUitvj8vxsR9o1PW9GS0an17GJEYuetLnkShKK3NWOhBBX6d1yP9rVdH6JhgIJEy/g0Suz7TAFiFc8i7JF8u4QJ05C8bZAMhOLotqftQeVOMCgYAid8aaRvaM2Q8a42Jn6ZTT5ms6AvNr98sv0StnfmNQ+EYXN0bEk2huSW+w2hN34TYYBTjViQmHbhudwwu8lVjEccDmIXsUFbHVK+kTIpWGGchy5cYPs3k9s1nMR2av0Lojtw9WRY76xRXvN8W6R7EhwA2ax3+gEEYpGhjM/lO2Lg==-----END PRIVATE KEY-----";

const signCadesRsa = (input: CadesSignatureInput): CadesSignatureOutput => {
  /*
  const rsaKey = generateKeys();
  const privateKeyPem = rsaKey.toPEM(true);
  const publickeyPem = rsaKey.toPEM(false);
*/
  // const prvKey = KEYUTIL.getKey(privateKeyPem);
  /* const sJWS = KJUR.jws.JWS.sign(
    "RS256",
    JSON.stringify({ alg: "RS256" }),
    input.data.toString(),
    privateKeyPem
  ); */
  // let sd = new KJUR.asn1.cms.SignedData();
  /*
  const sd = new KJUR.asn1.cms.SignedData();
  const eciObj = new KJUR.asn1.cms.EncapsulatedContentInfo("string");
  eciObj.setContentType("data");
  eciObj.setContentValueStr("aaa");
  sd.signerInfoList[0].setForContentAndHash({
    sdobj: sd,
    eciObj,
    hashAlg: "sha256",
  });
  sd.signerInfoList[0].setSignerIdentifier(pemTestCertificate);
  sd.signerInfoList[0].sign(pemTestPrivKey, "SHA256withRSA");
  console.warn(sd);
  const hex = sd.getContentInfoEncodedHex();


  const sd = new KJUR.asn1.cms.SignedData();
  const contentType = new KJUR.asn1.cms.ContentType({
    name: "Odyssey rocks the world!",
  });
  const messageDigest = new KJUR.asn1.cms.MessageDigest({
    hex: "EB9A7F16EA8A7045DA963047C8BC0E458A0290DA697AD6549510CBB4C983EAB1",
  });
*/
  /*
  const sd = new KJUR.asn1.cms.SignedData({
    version: 1,
    hashalgs: ["sha1"],
    econtent: {
      type: "data",
      content: {
        hex: "616161",
      },
    },
    certs: [pemTestCertificate],
    sinfos: [
      {
        version: 1,
        id: {
          type: "isssn",
          issuer: { str: "/C=US/O=T1" },
          serial: { int: 1 },
        },
        hashalg: "sha1",
        sattrs: {
          array: [
            {
              attr: "contentType",
              type: "1.2.840.113549.1.7.1",
            },
            {
              attr: "messageDigest",
              hex: "abcd",
            },
          ],
        },
        sigalg: "SHA1withRSA",
        signkey: pemTestPrivKey,
      },
    ],
  });
*/
  /*
  const signerIdentifier = new KJUR.asn1.cms.SignerIdentifier({
    type: "isssn",
    cert: pemTestCertificate,
  });
  console.log(signerIdentifier); */
  /*
  const sd = new KJUR.asn1.cms.SignedData({
    version: 1,
    hashalgs: ["sha256"],
    econtent: {
      type: "data",
      content: {
        str: "Odyssey rocks the world!",
      },
    },
    certs: [pemTestCertificate],
    sinfos: [
      {
        version: 1,
        id: {
          type: "isssn",
          cert: pemTestCertificate,
        },
        hashalg: "sha256",
        sattrs: {
          array: [
            {
              attr: "contentType",
              type: "1.2.840.113549.1.7.1",
            },
            {
              attr: "messageDigest",
              hex:
                "EB9A7F16EA8A7045DA963047C8BC0E458A0290DA697AD6549510CBB4C983EAB1",
            },
          ],
        },
        sigalg: "SHA256withRSA",
        signkey: pemTestPrivKey,
      },
    ],
  });
*/

  const params = {
    version: 1,
    hashalgs: ["sha256"],
    econtent: {
      type: "data",
      content: { str: input.data },
    },
    sinfos: [
      {
        version: 1,
        id: { type: "isssn", cert: input.pemCert },
        hashalg: "sha256",
        sattrs: {
          array: [
            {
              attr: "contentType",
              type: "data",
            },
            {
              attr: "signingTime",
              str: "131231235959Z",
            },
            {
              attr: "messageDigest",
              hex: input.hash,
            },
          ],
        },
        sigalg: "SHA256withRSA",
        signkey: input.pemPrivKey,
      },
    ],
  };
  const signedData = new KJUR.asn1.cms.SignedData(params);
  const hex = signedData.getContentInfoEncodedHex();
  // console.warn(ASN1HEX.dump(hex));

  const cadesOuput: CadesSignatureOutput = {
    cades: hex,
    verificationMethod: pemTestCertificate,
  };
  return cadesOuput;
};

const verifyCadesSignature = (hexSignature: string): boolean => {
  return false;
};

export { signCadesRsa, verifyCadesSignature };
