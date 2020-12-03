import { CadesSignatureInput, HashAlg } from "../../src/dtos/cades";
import { signCadesRsa, verifyCadesSignature } from "../../src/libs/eidas/cades";

// _test/z4.* RSA 2048bit
const SZ4_PRVP8PPEM = `-----BEGIN PRIVATE KEY-----
  MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDfdOqotHd55SYO
  0dLz2oXengw/tZ+q3ZmOPeVmMuOMIYO/Cv1wk2U0OK4pug4OBSJPhl09Zs6IwB8N
  wPOU7EDTgMOcQUYB/6QNCI1J7Zm2oLtuchzz4pIb+o4ZAhVprLhRyvqi8OTKQ7kf
  Gfs5Tuwmn1M/0fQkfzMxADpjOKNgf0uy6lN6utjdTrPKKFUQNdc6/Ty8EeTnQEwU
  lsT2LAXCfEKxTn5RlRljDztS7Sfgs8VL0FPy1Qi8B+dFcgRYKFrcpsVaZ1lBmXKs
  XDRu5QR/Rg3f9DRq4GR1sNH8RLY9uApMl2SNz+sR4zRPG85R/se5Q06Gu0BUQ3UP
  m67ETVZLAgMBAAECggEADjU54mYvHpICXHjc5+JiFqiH8NkUgOG8LL4kwt3DeBp9
  bP0+5hSJH8vmzwJkeGG9L79EWG4b/bfxgYdeNX7cFFagmWPRFrlxbd64VRYFawZH
  RJt+2cbzMVI6DL8EK4bu5Ux5qTiV44Jw19hoD9nDzCTfPzSTSGrKD3iLPdnREYaI
  GDVxcjBv3Tx6rrv3Z2lhHHKhEHb0RRjATcjAVKV9NZhMajJ4l9pqJ3A4IQrCBl95
  ux6Xm1oXP0i6aR78cjchsCpcMXdP3WMsvHgTlsZT0RZLFHrvkiNHlPiil4G2/eHk
  wvT//CrcbO6SmI/zCtMmypuHJqcr+Xb7GPJoa64WoQKBgQDwrfelf3Rdfo9kaK/b
  rBmbu1++qWpYVPTedQy84DK2p3GE7YfKyI+fhbnw5ol3W1jjfvZCmK/p6eZR4jgy
  J0KJ76z53T8HoDTF+FTkR55oM3TEM46XzI36RppWP1vgcNHdz3U4DAqkMlAh4lVm
  3GiKPGX5JHHe7tWz/uZ55Kk58QKBgQDtrkqdSzWlOjvYD4mq4m8jPgS7v3hiHd+1
  OT8S37zdoT8VVzo2T4SF+fBhI2lWYzpQp2sCjLmCwK9k/Gur55H2kTBTwzlQ6WSL
  Te9Zj+eoMGklIirA+8YdQHXrO+CCw9BTJAF+c3c3xeUOLXafzyW29bASGfUtA7Ax
  QAsR+Rr3+wKBgAwfZxrh6ZWP+17+WuVArOWIMZFj7SRX2yGdWa/lxwgmNPSSFkXj
  hkBttujoY8IsSrTivzqpgCrTCjPTpir4iURzWw4W08bpjd7u3C/HX7Y16Uq8ohEJ
  T5lslveDJ3iNljSK74eMK7kLg7fBM7YDogxccHJ1IHsvInp3e1pmZxOxAoGAO+bS
  TUQ4N/UuQezgkF3TDrnBraO67leDGwRbfiE/U0ghQvqh5DA0QSPVzlWDZc9KUitv
  j8vxsR9o1PW9GS0an17GJEYuetLnkShKK3NWOhBBX6d1yP9rVdH6JhgIJEy/g0Su
  z7TAFiFc8i7JF8u4QJ05C8bZAMhOLotqftQeVOMCgYAid8aaRvaM2Q8a42Jn6ZTT
  5ms6AvNr98sv0StnfmNQ+EYXN0bEk2huSW+w2hN34TYYBTjViQmHbhudwwu8lVjE
  ccDmIXsUFbHVK+kTIpWGGchy5cYPs3k9s1nMR2av0Lojtw9WRY76xRXvN8W6R7Eh
  wA2ax3+gEEYpGhjM/lO2Lg==
  -----END PRIVATE KEY-----`;

const SZ4_CERPEM = `-----BEGIN CERTIFICATE-----
  MIIC/zCCAeegAwIBAgIBATANBgkqhkiG9w0BAQUFADAaMQswCQYDVQQGEwJVUzEL
  MAkGA1UECgwCWjQwHhcNMTMwODI4MTgyODM0WhcNMjMwODI4MTgyODM0WjAaMQsw
  CQYDVQQGEwJVUzELMAkGA1UECgwCWjQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
  ggEKAoIBAQDfdOqotHd55SYO0dLz2oXengw/tZ+q3ZmOPeVmMuOMIYO/Cv1wk2U0
  OK4pug4OBSJPhl09Zs6IwB8NwPOU7EDTgMOcQUYB/6QNCI1J7Zm2oLtuchzz4pIb
  +o4ZAhVprLhRyvqi8OTKQ7kfGfs5Tuwmn1M/0fQkfzMxADpjOKNgf0uy6lN6utjd
  TrPKKFUQNdc6/Ty8EeTnQEwUlsT2LAXCfEKxTn5RlRljDztS7Sfgs8VL0FPy1Qi8
  B+dFcgRYKFrcpsVaZ1lBmXKsXDRu5QR/Rg3f9DRq4GR1sNH8RLY9uApMl2SNz+sR
  4zRPG85R/se5Q06Gu0BUQ3UPm67ETVZLAgMBAAGjUDBOMB0GA1UdDgQWBBQHZPTE
  yQVu/0I/3QWhlTyW7WoTzTAfBgNVHSMEGDAWgBQHZPTEyQVu/0I/3QWhlTyW7WoT
  zTAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4IBAQDHxqJ9y8alTH7agVMW
  Zfic/RbrdvHwyq+IOrgDToqyo0w+IZ6BCn9vjv5iuhqu4ForOWDAFpQKZW0DLBJE
  Qy/7/0+9pk2DPhK1XzdOovlSrkRt+GcEpGnUXnzACXDBbO0+Wrk+hcjEkQRRK1bW
  2rknARIEJG9GS+pShP9Bq/0BmNsMepdNcBa0z3a5B0fzFyCQoUlX6RTqxRw1h1Qt
  5F00pfsp7SjXVIvYcewHaNASbto1n5hrSz1VY9hLba11ivL1N4WoWbmzAL6BWabs
  C2D/MenST2/X6hTKyGXpg3Eg2h3iLvUtwcNny0hRKstc73Jl9xR3qXfXKJH0ThTl
  q0gq
  -----END CERTIFICATE-----`;

describe("cades tests should", () => {
  it("CADES-BES SHA256withRSA sign a given data and output a PEM CMS", () => {
    expect.assertions(1);
    const inputCades: CadesSignatureInput = {
      data: "jsrsasign",
      hashAlg: HashAlg.SHA256,
      pemCert: SZ4_CERPEM,
      pemPrivKey: SZ4_PRVP8PPEM,
    };
    const cadesOuput = signCadesRsa(inputCades);
    expect(cadesOuput.cades).toBeDefined();
  });

  it("CADES-BES SHA1withRSA sign a given data and output a PEM CMS", () => {
    expect.assertions(1);
    const inputCades: CadesSignatureInput = {
      data: "jsrsasign",
      hashAlg: HashAlg.SHA1,
      pemCert: SZ4_CERPEM,
      pemPrivKey: SZ4_PRVP8PPEM,
    };
    const cadesOuput = signCadesRsa(inputCades);
    expect(cadesOuput.cades).toBeDefined();
  });

  it("CADES-BES SHA512withRSA sign a given data and output a PEM CMS", () => {
    expect.assertions(1);
    const inputCades: CadesSignatureInput = {
      data: "jsrsasign",
      hashAlg: HashAlg.SHA1,
      pemCert: SZ4_CERPEM,
      pemPrivKey: SZ4_PRVP8PPEM,
    };
    const cadesOuput = signCadesRsa(inputCades);
    expect(cadesOuput.cades).toBeDefined();
  });

  it("verify a PEM CADES signature", () => {
    expect.assertions(3);
    const inputCades: CadesSignatureInput = {
      data: "jsrsasign",
      hashAlg: HashAlg.SHA256,
      pemCert: SZ4_CERPEM,
      pemPrivKey: SZ4_PRVP8PPEM,
    };
    const cadesOuput = signCadesRsa(inputCades);
    const verificationOut = verifyCadesSignature(cadesOuput.cades);
    expect(verificationOut).toBeDefined();
    expect(verificationOut.isValid).toBe(true);
    expect(verificationOut.parse).toBeDefined();
  });
});
