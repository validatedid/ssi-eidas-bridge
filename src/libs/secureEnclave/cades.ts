/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestError } from "@cef-ebsi/problem-details-errors";
import { KJUR } from "jsrsasign";
import axios from "axios";
import constants from "../../@types";
import { indication } from "../../dtos";
import {
  CadesSignatureInput,
  CadesSignatureOutput,
  CadesVerificationOutput,
  DerSigningTime,
} from "../../dtos/cades";
import { ApiErrorMessages } from "../../errors";
import { removePemHeader, replacePemNewLines } from "../../utils/util";
import { DssVerificationInput, DssVerificationOutput } from "../../dtos/dss";
import { DSS_URL } from "../../config";

const signCadesRsa = (input: CadesSignatureInput): CadesSignatureOutput => {
  const date = new KJUR.asn1.DERUTCTime({
    date: new Date(input.created),
  }) as DerSigningTime;

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
        id: { type: "isssn", cert: input.pemCert },
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
    signingTime: input.created,
  };
  return cadesOuput;
};

const prepareDssInput = (pemCades: string): DssVerificationInput => {
  return {
    signedDocument: {
      bytes: removePemHeader(pemCades),
      digestAlgorithm: null,
      name: "cades.pem",
    },
    originalDocuments: null,
    policy: null,
    tokenExtractionStrategy: "NONE",
    signatureId: null,
  };
};

const getEcontentFromCAdES = async (pemCades: string): Promise<string> => {
  const dssInput = {
    signedDocument: {
      bytes: removePemHeader(pemCades),
      digestAlgorithm: null,
      name: null,
    },
    originalDocuments: null,
    policy: null,
    tokenExtractionStrategy: "NONE",
    signatureId: null,
  };

  const response = await axios.post(DSS_URL.ORIGINAL_DOCUMENTS, dssInput);

  return response.data[0].bytes as string;
};

const prepareCadesVerifiationOutput = (
  dssVerificationOutput: DssVerificationOutput,
  eContent: string
): CadesVerificationOutput => {
  const output: CadesVerificationOutput = {
    isValid:
      dssVerificationOutput.SimpleReport.signatureOrTimestamp[0].Signature
        .Indication === indication.VERIFICATION_SUCCESS,
    DssVerificationOutput: dssVerificationOutput,
    parse: {
      econtent: eContent,
    },
  };
  return output;
};

const verifyCadesSignature = async (
  pemCades: string
): Promise<CadesVerificationOutput> => {
  if (!pemCades)
    throw new BadRequestError(indication.VERIFICATION_FAIL, {
      detail: ApiErrorMessages.NO_PEM_CADES,
    });
  const dssVerificationInput: DssVerificationInput = prepareDssInput(pemCades);
  const response = await axios.post(
    DSS_URL.VALIDATE_SIGNATURE,
    dssVerificationInput
  );
  const eContent = await getEcontentFromCAdES(pemCades);
  return prepareCadesVerifiationOutput(
    response.data as DssVerificationOutput,
    eContent
  );
};

export { signCadesRsa, verifyCadesSignature, getEcontentFromCAdES };
