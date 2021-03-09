import crypto from "crypto";
import { CadesSignatureInput } from "../../src/dtos/cades";
import {
  signCadesRsa,
  verifyCadesSignature,
} from "../../src/libs/secureEnclave/cades";
import { toISOStringSeconds } from "../../src/utils/ssi";

const SZ4_PRVP8PPEM = `-----BEGIN PRIVATE KEY-----
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
4zcL+O/5+lmVHr82QRsJ/gucoBhNnA==
-----END PRIVATE KEY-----`;

const SZ4_CERPEM = `-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIUHxXsmPLjN2IdjhrU98cM9+e1GG0wDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yMTAyMjQxMDE1MjBaFw0zMTAy
MjIxMDE1MjBaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggIiMA0GCSqGSIb3DQEB
AQUAA4ICDwAwggIKAoICAQCw95WlGzm/19nrYPcbPxurRqvDh6vD0O7/jGxZ2CZt
7yk6K1WapPbvKhxhUu2m6h9dNhSH7B/2TLB/+qGeVx2lDIta6ty3XyHXD/xeMSsY
1VaFBcomR9ytBu0WO46Xw3PVhLvAQKdLrqjlqvweOSxvCt21kM5jfcv/NagZqE6H
1zhrX66ZtoCLt1/OMhBRmR9r7nDZBO1hNtbb5JyWqE+ZY8+9Vc1PG+TZYXmvxLD6
SYGLY8DMUGG0+N/K6ZUyrY1r9/s6YyylGNNjpvtmG/Z9RCuidamCbGxTNHBUdGS6
Z9NYd5pHjXyGdlTdQRFZ9ZoWxr+rYuf7WxPN2EKOc4AnVVfUTrMJQMBWOK8SC6VF
aN8XjBzAz62kDTxIH0ZdAJ2xpHh2ghJmhGLGqQ+WJKaAVNSDOA3fuXw8NkWLuzYt
wrTRMbwM4F1CqCsAPaTkCHG1hGK2wb1+CXTNGAO90KLXQ7txclH8SGFVM/UvPEeA
2K49Wvbb609kVBagSkp66MyMfGoYcFXd8ehOfepLC0w4mOvuKPXyxuAQlFwbJEY3
KXKFiZxbsYa9xPcxB9ZPSPfvRntIJR5OCe3YOlv2k1K3c2zF67+jyRkq9xkmhjya
Xvgq3qDSh76gzy143nA24+Xe36ceET2mmLpVDC8RBC+2XlfQYwIMX0Ez4v/KlqUz
VQIDAQABo1MwUTAdBgNVHQ4EFgQUip23N7JvA3dGdmOsDCLl3d4+uTswHwYDVR0j
BBgwFoAUip23N7JvA3dGdmOsDCLl3d4+uTswDwYDVR0TAQH/BAUwAwEB/zANBgkq
hkiG9w0BAQsFAAOCAgEAAtB8mLv2QlI3af0WOhznRUIMKYgTVVd4rjli9lK0lkwP
PDv0TxENz1ijsbnvFHgWNPYoJ0N4dYgmGOcrUwNpKABHlmBcdSt6TLNGn9QO00I5
KfSbMx6a71/A/agv6rPqby6yKgt8DzO2EL20pbL78+A8l6KZnerWtRzRPeEg3tGn
Y1mg3+frLpeYqIEgbwjjGTH1+UNNRVnhZ8D6KsbSAB4iA0YnzoLYq+BVunl0LPxB
74b3MyPCPsN+2+3WULDNsnlpp1SpkgPcNAeE0a8kM9BMsqKM0uI+n+KwnWDQDI/4
1f6eTLQdWvpYF0l2H1tvzm88TWHM3khkaD6u+7BzvoLPXK1yiir+BznPVsBMzO3P
HZyAeqA4HAU7ITVntAjNyQbTOwJAsEH8czw6X3wkc0yApNguLgcxH3k+Ab8iJOO8
qxoIvP2+jnP4vSeOoGJ0eKmRXSX27hZRv3eCWG3SJNGW9cU7tyn2PId6hMPfnSdm
ZbyTg7sZmBadpgA8bKyIsFitkNQrHixrhTBZbB27nI//PjsIKoJCFKjWhxSK3vD8
qD3Ga4QLACf/mYBeWmSH2JWtUtc4hS1u9SBnxao98rEbE0bx+HuFjqVsilvDC26q
AF8gFHPBTMM8tq74EWdco7RfG61ZuH34S7LeZHAOeld0BldNnhHUje84B8FR1Mo=
-----END CERTIFICATE-----`;

describe("cades tests should", () => {
  describe("sign", () => {
    it("given data with CADES-BES SHA256withRSA and output a PEM CMS", () => {
      expect.assertions(2);
      const hash = crypto.createHash("sha256");
      hash.update("jsrsasign");
      const inputCades: CadesSignatureInput = {
        data: hash.digest("hex"),
        created: toISOStringSeconds(new Date(Date.now())),
        pemCert: SZ4_CERPEM,
        pemPrivKey: SZ4_PRVP8PPEM,
      };
      const cadesOuput = signCadesRsa(inputCades);
      expect(cadesOuput.cades).toBeDefined();
      expect(cadesOuput.signingTime).toMatch(inputCades.created);
    });
  });
  describe("verify", () => {
    it("integrity of PEM CADES signature", async () => {
      expect.assertions(2);
      const hash = crypto.createHash("sha256");
      hash.update("jsrsasign");
      const inputCades: CadesSignatureInput = {
        data: hash.digest("hex"),
        created: toISOStringSeconds(new Date(Date.now())),
        pemCert: SZ4_CERPEM,
        pemPrivKey: SZ4_PRVP8PPEM,
      };
      const cadesOuput = signCadesRsa(inputCades);
      const verificationOut = await verifyCadesSignature(cadesOuput.cades);
      expect(
        verificationOut.DssVerificationOutput.DiagnosticData.Signature[0]
          .BasicSignature.SignatureValid
      ).toBe(true);
      expect(verificationOut.parse).toBeDefined();
    });
  });
});
