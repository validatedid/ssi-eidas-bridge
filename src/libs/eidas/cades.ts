/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestError } from "@cef-ebsi/problem-details-errors";
import { KJUR } from "jsrsasign";
import {
  CadesSignatureInput,
  CadesSignatureOutput,
  CadesVerificationOutput,
  HashAlg,
  HashAlgKeyType,
} from "../../dtos/cades";
import { ApiErrorMessages } from "../../errors";
import { pemtohex } from "../../utils/util";

const signCadesRsa = (input: CadesSignatureInput): CadesSignatureOutput => {
  let sigalg: string;
  if (
    input.hashAlg !== HashAlg.SHA1 &&
    input.hashAlg !== HashAlg.SHA256 &&
    input.hashAlg !== HashAlg.SHA512
  )
    throw new BadRequestError(ApiErrorMessages.INVALID_HASH_ALG);
  if (input.hashAlg === HashAlg.SHA1) sigalg = HashAlgKeyType.SHA1_RSA;
  if (input.hashAlg === HashAlg.SHA256) sigalg = HashAlgKeyType.SHA256_RSA;
  if (input.hashAlg === HashAlg.SHA512) sigalg = HashAlgKeyType.SHA512_RSA;

  const dataDigest = KJUR.crypto.Util.hashString(input.data, input.hashAlg);

  const param = {
    version: 1,
    hashalgs: [HashAlg.SHA1, HashAlg.SHA256, HashAlg.SHA512],
    econtent: {
      type: "data",
      content: { str: input.data },
    },
    certs: [input.pemCert],
    sinfos: [
      {
        version: 1,
        id: { type: "isssn", cert: input.pemCert },
        hashalg: input.hashAlg,
        sattrs: {
          array: [
            {
              attr: "contentType",
              type: "data",
            },
            {
              attr: "signingTime",
              str: "",
            },
            {
              attr: "messageDigest",
              hex: dataDigest,
            },
            {
              attr: "signingCertificateV2",
              array: [input.pemCert],
            },
          ],
        },
        sigalg,
        signkey: input.pemPrivKey,
      },
    ],
  };
  /*
  if (input.oid) {
    param.sinfos[0].sattrs.array.push({
      attr: "signaturePolicyIdentifier",
      oid: input.oid,
      alg: input.hashAlg,
      hash: dataDigest,
    });
  }
  */

  const signedData = new KJUR.asn1.cms.SignedData(param);
  const hexSignedData = signedData.getContentInfoEncodedHex();
  const pemSignedData = KJUR.asn1.ASN1Util.getPEMStringFromHex(
    hexSignedData,
    "CMS"
  );

  const cadesOuput: CadesSignatureOutput = {
    cades: pemSignedData,
    verificationMethod: input.pemCert,
  };
  return cadesOuput;
};

const verifyCadesSignature = (pemCades: string): CadesVerificationOutput => {
  if (!pemCades)
    throw new BadRequestError(BadRequestError.defaultTitle, {
      detail: ApiErrorMessages.NO_PEM_CADES,
    });
  const hexSignedData = pemtohex(pemCades, "CMS");
  const verifiedData = KJUR.asn1.cms.CMSUtil.verifySignedData({
    cms: hexSignedData,
  });
  return verifiedData;
};

export { signCadesRsa, verifyCadesSignature };
