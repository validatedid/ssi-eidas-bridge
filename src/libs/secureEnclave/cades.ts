/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestError } from "@cef-ebsi/problem-details-errors";
import { pki, util } from "node-forge";
import { KJUR } from "jsrsasign";
import constants from "../../@types";
import { indication } from "../../dtos";
import {
  CadesSignatureInput,
  CadesSignatureOutput,
  CadesVerificationOutput,
  DerSigningTime,
} from "../../dtos/cades";
import { ApiErrorMessages } from "../../errors";
import { parseSigningTime } from "../../utils/ssi";
import { pemtohex, replacePemNewLines } from "../../utils/util";

const signCadesRsa = (input: CadesSignatureInput): CadesSignatureOutput => {
  const date = new KJUR.asn1.DERUTCTime({
    date: new Date(Date.now()),
  }) as DerSigningTime;

  const cert = pki.certificateFromPem(input.pemCert);

  const issuer = KJUR.asn1.x509.X500Name.ldapToCompat(
    `OU=${util.decodeUtf8(
      cert.issuer.getField("OU").value as string
    )},O=${util.decodeUtf8(cert.issuer.getField("O").value as string)},C=${
      cert.issuer.getField("C").value as string
    }`
  );

  const issuerAndSerialNumber = new KJUR.asn1.cms.SignerIdentifier({
    type: "isssn",
    issuer: { str: issuer },
    serial: { hex: cert.serialNumber },
  });

  const param = {
    version: 1,
    hashalgs: [constants.HashAlg.SHA256],
    econtent: {
      type: "data",
      content: { hex: input.data },
    },
    certs: [input.pemCert],
    sinfos: [
      {
        version: 1,
        id: issuerAndSerialNumber.params,
        hashalg: constants.HashAlg.SHA256,
        sattrs: {
          array: [
            {
              attr: "contentType",
              type: "data",
            },
            {
              attr: "signingTime",
              str: date.s,
            },
            {
              attr: "messageDigest",
              hex: input.data,
            },
            {
              attr: "signingCertificateV2",
              array: [input.pemCert],
            },
          ],
        },
        sigalg: constants.HashAlgKeyType.SHA256_RSA,
        signkey: input.pemPrivKey,
      },
    ],
  };

  const signedData = new KJUR.asn1.cms.SignedData(param);
  const hexSignedData = signedData.getContentInfoEncodedHex();
  const pemSignedData = KJUR.asn1.ASN1Util.getPEMStringFromHex(
    hexSignedData,
    "PKCS7"
  ) as string;

  const cadesOuput: CadesSignatureOutput = {
    cades: replacePemNewLines(pemSignedData, "PKCS7"),
    verificationMethod: input.pemCert,
    signingTime: parseSigningTime(date.s),
  };
  return cadesOuput;
};

const verifyCadesSignature = (pemCades: string): CadesVerificationOutput => {
  if (!pemCades)
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: ApiErrorMessages.NO_PEM_CADES,
    });
  const hexSignedData = pemtohex(pemCades, constants.DEFAULT_CMS_HEADER);
  return KJUR.asn1.cms.CMSUtil.verifySignedData({
    cms: hexSignedData,
  }) as CadesVerificationOutput;
};

export { signCadesRsa, verifyCadesSignature };
