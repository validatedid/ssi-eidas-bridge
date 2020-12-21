import fs from "fs";
import path from "path";
import { eidasCrypto } from "../../src/utils";

describe("eidas crypto tests should", () => {
  const testFilePathWithCa = "../data/test2/";
  const testFilePathSelfSigned = "../data/test1/";
  const p12File = "keyStore.p12";
  it("parse a P12 file with chained certs", () => {
    expect.assertions(3);

    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathWithCa}${p12File}`),
      { encoding: "binary" }
    );
    const expectedKey = `-----BEGIN RSA PRIVATE KEY-----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-----END RSA PRIVATE KEY-----`;
    const expectedCerts = [
      `-----BEGIN CERTIFICATE-----MIIE0DCCA7gCFB5BQOH1HckOeCWWWW7pOEVhSrN9MA0GCSqGSIb3DQEBCwUAMIGgMQswCQYDVQQGEwJFUzESMBAGA1UECAwJQ2F0YWxvbmlhMRIwEAYDVQQHDAlCYXJjZWxvbmExGzAZBgNVBAoMElZhbGlkYXRlZCBJZCBDQSBzbDEeMBwGA1UECwwVQ2VydGlmaWNhdGUgQXV0aG9yaXR5MSwwKgYJKoZIhvcNAQkBFh12aWRjaGFpbit0ZXN0QHZhbGlkYXRlZGlkLmNvbTAeFw0yMDEyMDMwNzM3NThaFw0yMTEyMDMwNzM3NThaMIGnMQswCQYDVQQGEwJFUzESMBAGA1UECAwJQ2F0YWxvbmlhMRIwEAYDVQQHDAlCYXJjZWxvbmExGDAWBgNVBAoMD1ZhbGlkYXRlZCBJZCBzbDERMA8GA1UECwwIVklEY2hhaW4xFTATBgNVBAMMDFZhbGlkYXRlZCBJZDEsMCoGCSqGSIb3DQEJARYddmlkY2hhaW4rdGVzdEB2YWxpZGF0ZWRpZC5jb20wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQCjMGCtIcWt7PBsNQtAIU+eVj4lG+MD7YTMrMSRiuTU7k9RA03FWD1OmEJYe2AWOfj4tQXUksLMs9QCWPZ0gFfeC+jlSXf3Y4cxW7C8WLAOAt2OfQXVLUY6JzvZNAN7O8Lt56e6z76ObaNfsYKHfry3i49UlWO57qzgPLVpn/Yq03oNRfbaULoEYX06ocwdCBJK1CzJRLWy1vH85ww0+xxCh8RYKuWLSpmjG/lXMwY8QdYMvQ7pJf4i+jsTx4SqdVDf9NgNZO3AtNMTk7kbiAsbqLmUOXGD5rh7wVHecUcqJaf+gNRHsBbEs5IJnqHTb6IBy9UDowMUmIma5WDDlbOGUjEIRs3DTId6a6MvSulAe6Ae2Akd0qqZSOtuCm6GPNobspth7kojb6ucmSQpb6EyhWkJaS4LzoyZCmaeEWF+ojPelvUjkoWp+jdEjEXK7o+i7K4288lhsHGWc/vWBt4+dnmN5judDAtteTVEQGebhD9y3o4OCi4KRwapE5KxPOpXMuxVNlKxjtmT9eqJCp7sM2B2NaxpqO+NGN2OuTWMLMtEld1UXo5zC10rpGD7Uq8+rpca3RjS7M5Tkg5lp8+Fv6ZmX4LRsnXAS13qRmRn0Yy0cFiRxU6v/kuKWL3eNuuMMd30kQ1j/hP1an+8+U2Nrbc82kEwwLr0asgXWjMjowIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAniWQbPVMjPvUajJMXEH80AUJKq/3woKfnrdZXjepwUjrPm0f7J00UYWTIa/wfAstP0gk//R8dOuYQAPo7QGEp9Qb4OytSX72gRhJi8L01lp1x5KD8yfrlKH3vkzU2jxjVV5GYVBGZ7I24VbCXnXiw36ETb9F651AFA3KYESOSFQ46iuTAhU6wAci3me4Rb2aya+7mOv8dFuL/NCqnZq1viXxFioaHZvcTdRIHXSlETPS/fK3IQTB3BaxiZObsH2g+YDFEpkf5Lg9FGZw1fa1/6MJOFiech4yTMeiXrfnJ+Tt+LCFtXlGRiMiVSMnKWdbl2yKcZNFGccYhV7sDDPJ/-----END CERTIFICATE-----`,
      `-----BEGIN CERTIFICATE-----MIIEIzCCAwugAwIBAgIUUFkcd9qak/B78N2eMY16NivxTtkwDQYJKoZIhvcNAQELBQAwgaAxCzAJBgNVBAYTAkVTMRIwEAYDVQQIDAlDYXRhbG9uaWExEjAQBgNVBAcMCUJhcmNlbG9uYTEbMBkGA1UECgwSVmFsaWRhdGVkIElkIENBIHNsMR4wHAYDVQQLDBVDZXJ0aWZpY2F0ZSBBdXRob3JpdHkxLDAqBgkqhkiG9w0BCQEWHXZpZGNoYWluK3Rlc3RAdmFsaWRhdGVkaWQuY29tMB4XDTIwMTIwMzA2NDQwOVoXDTIxMTIwMzA2NDQwOVowgaAxCzAJBgNVBAYTAkVTMRIwEAYDVQQIDAlDYXRhbG9uaWExEjAQBgNVBAcMCUJhcmNlbG9uYTEbMBkGA1UECgwSVmFsaWRhdGVkIElkIENBIHNsMR4wHAYDVQQLDBVDZXJ0aWZpY2F0ZSBBdXRob3JpdHkxLDAqBgkqhkiG9w0BCQEWHXZpZGNoYWluK3Rlc3RAdmFsaWRhdGVkaWQuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmEQ0Zc1kvgs3oeT8/RTrurbQalCZgmxu9oh7GgCc6KPClVmsuDq7VjNgS1ndbyb8wHVqIEm4Fzm28DJuyKdHk1OpwnepHcjVO3aeb13qvRUsCwLhj+Y62inyq3Y/om0qhRz4EcvjvAD2yHU2b0a9eXIvuCcD/3nJRL188OHVbtPaxRdE+kQ7zKD9BQSFoLNfPhnfUZVUuT+/eloAX2YLac7gDNVXxVt9eGPu0Xer/mN5iC3e2LdsvAZSN1nbfm78gsgXIWZUIekbEWscxDtgh63+tDbNnwS6GzLB3Djx8WMV08XswQLUaixhmOTk/63vVnrpmPIg2fgAmagh0ySjQwIDAQABo1MwUTAdBgNVHQ4EFgQUl8RIV/7ezqmQxfgn6HnCgD32+OUwHwYDVR0jBBgwFoAUl8RIV/7ezqmQxfgn6HnCgD32+OUwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAZVpbzEgQktnxhIsh+cAwwcyjlVoFqZRdeXQ7NeUleZeE7Tuib0qPRpYnZ5mHe+fey4BbOsXnbxF6p8THRqYn6r5vy9d6w+LyjwLdBkn2c9Sc/A6P/OH2nJ4XPeM/EFcREBGgOedbRQPwFIztcB40241LvIJJ/qinhiWhbVI4hn471dx35s95+3+GCpJsBDLVMdfrWHNbIdAT/EE0efxhOOS/CSjZ/sgiYcpWWGjzZMpfq0i37qOopRvBsirP9ijpIJ+axZqsRoXzUThSwItxWBsVpkV67N0CbBnYHTY/LWcjMmwyJCSUYrso7coXDXg9zWk/FIw+R27SzJW8g1Pn2A==-----END CERTIFICATE-----`,
    ];
    const result = eidasCrypto.parseP12File(fileData, "vidchain");
    expect(result).toBeDefined();
    expect(result.pemPrivateKey).toStrictEqual(expectedKey);
    expect(result.pemCert.every((cert) => expectedCerts.includes(cert))).toBe(
      true
    );
  });

  it("parse a P12 file with a self-signed cert", () => {
    expect.assertions(3);

    const fileData = fs.readFileSync(
      path.join(__dirname, `${testFilePathSelfSigned}${p12File}`),
      { encoding: "binary" }
    );
    const expectedKey = `-----BEGIN RSA PRIVATE KEY-----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-----END RSA PRIVATE KEY-----`;
    const expectedCerts = [
      `-----BEGIN CERTIFICATE-----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-----END CERTIFICATE-----`,
    ];
    const result = eidasCrypto.parseP12File(fileData, "vidchain");
    expect(result).toBeDefined();
    expect(result.pemPrivateKey).toStrictEqual(expectedKey);
    expect(expectedCerts.every((cert) => result.pemCert.includes(cert))).toBe(
      true
    );
  });
  it("return a PEM public key from a certificate", () => {
    expect.assertions(1);
    const inputCert = `-----BEGIN CERTIFICATE-----MIIGMTCCBBmgAwIBAgIUHL2U6P+dN5QPxlTduaSSySuCQ+wwDQYJKoZIhvcNAQELBQAwgacxCzAJBgNVBAYTAkVTMRIwEAYDVQQIDAlDYXRhbG9uaWExEjAQBgNVBAcMCUJhcmNlbG9uYTEYMBYGA1UECgwPVmFsaWRhdGVkIElkIHNsMREwDwYDVQQLDAhWSURjaGFpbjEVMBMGA1UEAwwMVmFsaWRhdGVkIElkMSwwKgYJKoZIhvcNAQkBFh12aWRjaGFpbit0ZXN0QHZhbGlkYXRlZGlkLmNvbTAeFw0yMDEyMDMwNjEzNDhaFw0zMDEyMDEwNjEzNDhaMIGnMQswCQYDVQQGEwJFUzESMBAGA1UECAwJQ2F0YWxvbmlhMRIwEAYDVQQHDAlCYXJjZWxvbmExGDAWBgNVBAoMD1ZhbGlkYXRlZCBJZCBzbDERMA8GA1UECwwIVklEY2hhaW4xFTATBgNVBAMMDFZhbGlkYXRlZCBJZDEsMCoGCSqGSIb3DQEJARYddmlkY2hhaW4rdGVzdEB2YWxpZGF0ZWRpZC5jb20wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQC9w85Lvfppfa1/ASP6YwIneTDooEIMctE2q2QOx5c1O6F0izlSPvA9w4RN7FPUOcYN89ncdgGxzzHyNYoW078TmioXNcPKrrQbxCaW3nT0kpAks/RjGtfCNlwsP+4z1B/yUKOOJUmMNifO0TzynmORDZX0cJ/c0rcBIvebargzlBEc0aJNO8K9xEbapGhxUincQHx/AimCpbGLq4jbjbITsTUnh9UNeUPiFimhwMfQc7NrNBes25sfPoQaQ63mcAp4TNOioT2jD76HpNEeF+Z1YkVvYdDsW+gAxRiilAloqmT9XkWmZdMPIw823a6P1QFL8Qwvtne9fNdRQmr+lNt20killpmTRI4J23eJaTwII0gcAd03S7L5JYL4AfSG/nq6tCpHRlrPfd8aC6Fu5RgrNe3UJNCAJOQSFzBP1KaXibVYYyXd9sUwWRpw8ZHBIyzllcqMMJF3P43z+kUTE66hsKogxQ8YL3xNWxXd2uuxJ7vXoJIdLcFa5q6b9be97nDVnXWcZtGKH1fkC5iDm3+DAUOyDTmJBrvrKbNZJpkQQvlu0e8Jc2yazINTWf8onDhLyedeP6q37Es0Q01ayKNw/tWcTVuRe8RDSuD897CY9YpUsgdl/mzxElOYB0IUTQglPVaJe5/BP1BRroF/ITWY6meTgunCSFyYzSM0AMe+nwIDAQABo1MwUTAdBgNVHQ4EFgQU5S41AACGcP1vjXzbvoB6Ar+7KgwwHwYDVR0jBBgwFoAU5S41AACGcP1vjXzbvoB6Ar+7KgwwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAgEAC3M+mUdg74yxBoZLdUDur7L7SNTxrorzKgxGaIpHNFJWDtIWvpqYhmTmYdyvX2GTtj4BqgeAzihAMl8zKwgtxfFc3cnFLsWSLo0KihC6FjvKB/Rabf7hyp7LUesG8b0+4JzlVVm+yuxRioFjW5De3GM+MRuulr3bw8VW3NmnVjzazL2F4bRDCv4Y4LGBP3Q3598Otu3BMVbaH3ye9F24BAxcdujaPPCOl2YvdT0hE+0/kId9aMnfBPFFLKHS9p5Vm4oeZbd7Gt/pJiN/LWlgAxGQ0H4GcpstSJVHim/DLv2WOmkvteULPhJgjBrpNN1viX8lnMwfaaWSdDFsVZON8Zp3S+0Z3+gsfadhGoK6PFx716My6RNWlMvWQLVu+RWz0ZPPXtly58fgl6MMOv/q1LeFMwhQ0FkpatWovOHy2udHA33Yrlnn7I3EesMXHsefl8lCncW4BYEkB1ih56unXwJ57Eag169+vdRAqpQ2phHx6em51SnJVU7iw7B6QDiH+oZEYYlpVE+66lFgPyzN/DediqCC4SnEw8BAYJdtOABxVSE5QKT02osXeJfJt0oU5dYT2x2qLGYqcwVdFS0vrHMAjDthDTgalXChuK++ZkFmOW+iX5z8KDoP4KFvs/cAkXzHs5/jvWO4r6KbZIHBi9ydazQCcmSM53zefOMJ1Uc=-----END CERTIFICATE-----`;
    const expectedPublicKey =
      "-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvcPOS736aX2tfwEj+mMC\r\nJ3kw6KBCDHLRNqtkDseXNTuhdIs5Uj7wPcOETexT1DnGDfPZ3HYBsc8x8jWKFtO/\r\nE5oqFzXDyq60G8Qmlt509JKQJLP0YxrXwjZcLD/uM9Qf8lCjjiVJjDYnztE88p5j\r\nkQ2V9HCf3NK3ASL3m2q4M5QRHNGiTTvCvcRG2qRocVIp3EB8fwIpgqWxi6uI242y\r\nE7E1J4fVDXlD4hYpocDH0HOzazQXrNubHz6EGkOt5nAKeEzToqE9ow++h6TRHhfm\r\ndWJFb2HQ7FvoAMUYopQJaKpk/V5FpmXTDyMPNt2uj9UBS/EML7Z3vXzXUUJq/pTb\r\ndtJIpZaZk0SOCdt3iWk8CCNIHAHdN0uy+SWC+AH0hv56urQqR0Zaz33fGguhbuUY\r\nKzXt1CTQgCTkEhcwT9Sml4m1WGMl3fbFMFkacPGRwSMs5ZXKjDCRdz+N8/pFExOu\r\nobCqIMUPGC98TVsV3drrsSe716CSHS3BWuaum/W3ve5w1Z11nGbRih9X5AuYg5t/\r\ngwFDsg05iQa76ymzWSaZEEL5btHvCXNsmsyDU1n/KJw4S8nnXj+qt+xLNENNWsij\r\ncP7VnE1bkXvEQ0rg/PewmPWKVLIHZf5s8RJTmAdCFE0IJT1WiXufwT9QUa6BfyE1\r\nmOpnk4LpwkhcmM0jNADHvp8CAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n";
    const publicKey = eidasCrypto.getPemPublicKeyfromPemCert(inputCert);
    expect(publicKey).toStrictEqual(expectedPublicKey);
  });
});
