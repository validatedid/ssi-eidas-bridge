import { CadesSignatureInput } from "../../src/dtos/cades";
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
  /*
  it.skip("create a rsa key", () => {
    
    expect.assertions(1);
    const inputCades: CadesSignatureInput = {
      issuer: "did:example:123456",
      data: "Odyssey rocks the world!",
    };
    const outputCades = signCadesRsa(inputCades);
    expect(outputCades).toBeDefined();
  });
  */

  it.only("CMS sign a given string data and check it with the expected hex value", () => {
    expect.assertions(1);
    const inputCades: CadesSignatureInput = {
      data: "jsrsasign",
      hash: "84c24dd1d9f56eb3a07ae4a23445add4facbaed78c89475296ab7954284d9cd4",
      pemCert: SZ4_CERPEM,
      pemPrivKey: SZ4_PRVP8PPEM,
    };
    const cadesOuput = signCadesRsa(inputCades);
    // console.warn(cadesOuput.cades);
    const hExpect =
      "308201fa06092a864886f70d010702a08201eb308201e7020101310f300d06096086480165030402010500301806092a864886f70d010701a00b04096a737273617369676e318201b5308201b1020101301f301a310b3009060355040613025553310b3009060355040a0c025a34020101300d06096086480165030402010500a069301806092a864886f70d010903310b06092a864886f70d010701301c06092a864886f70d010905310f170d3133313233313233353935395a302f06092a864886f70d0109043122042084c24dd1d9f56eb3a07ae4a23445add4facbaed78c89475296ab7954284d9cd4300d06092a864886f70d01010b0500048201002e102927a557ecef796fc36b5d858207e93927343361fe5136ce34e645347765ac5de316190ad57bc96bfdff34d7829c7cb6280470a32c3a3965149aed9f1032f9d4f92cecb5038c19b6f0b0f894e730e138cf2f5a7ce1f239535b829977ce1ad4b2fcf226953edecaabf6a5b7fcd179a5e6bd1b44c1f101341a4ac38f7d2d086c2d00cc3c6ad7fb07525cf7cb766420e5f628c36ddaefb708701666a301bc8f1b9c24ca0e50bf4626648d15b2c9eee1b87453f15ca27f3e0580095947a58bcc3ff685b7c4c2cedb3aefe77a87d8ed57eab22a082220e909088cfb18f951c65a9cd39213f9a7e3a81b13b6137f0283da99e0302a9c27238099e31cb5656e3200";
    expect(cadesOuput.cades).toStrictEqual(hExpect);
  });
  /*
  it("verify a CMS signature", () => {
    expect.assertions(1);
    const inputCades: CadesSignatureInput = {
      data: "jsrsasign",
      hash: "84c24dd1d9f56eb3a07ae4a23445add4facbaed78c89475296ab7954284d9cd4",
      pemCert: SZ4_CERPEM(),
      pemPrivKey: SZ4_PRVP8PPEM(),
    };
    const cadesOuput = signCadesRsa(inputCades);
    // console.warn(cadesOuput.cades);
    const verification = verifyCadesSignature(cadesOuput.cades);
    expect(verification).toBe(true);
  });
  */
});
