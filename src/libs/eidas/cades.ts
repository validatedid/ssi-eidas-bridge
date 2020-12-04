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
  const dataDigest = KJUR.crypto.Util.hashString(input.data, HashAlg.SHA256);

  const param = {
    version: 1,
    hashalgs: [HashAlg.SHA256],
    econtent: {
      type: "data",
      content: { str: input.data },
    },
    certs: [input.pemCert],
    sinfos: [
      {
        version: 1,
        id: { type: "isssn", cert: input.pemCert },
        hashalg: HashAlg.SHA256,
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
        sigalg: HashAlgKeyType.SHA256_RSA,
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
    "PKCS7"
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
  const hexSignedData = pemtohex(pemCades, "PKCS7");
  const verifiedData = KJUR.asn1.cms.CMSUtil.verifySignedData({
    cms: hexSignedData,
  });
  return verifiedData;
};

export { signCadesRsa, verifyCadesSignature };
