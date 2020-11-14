import { decodeJWT, verifyJWT } from "did-jwt";
import VidDidResolver from "@validatedid/vid-did-resolver";
import { Resolver } from "did-resolver";
import { SignPayload } from "../../dtos/secureEnclave";
import {
  Credential,
  EIDASSignatureOutput,
  VerifiableCredential,
} from "../../dtos/eidas";
import { BadRequestError, InternalError, ApiErrorMessages } from "../../errors";
import { Proof } from "../../libs/eidas/types";
import {
  JWTVerifyOptions,
  SignatureTypes,
  VerifiedJwt,
} from "../../libs/secureEnclave/jwt";
import {
  DEFAULT_PROOF_PURPOSE,
  DEFAULT_EIDAS_VERIFICATION_METHOD,
} from "../../libs/eidas/constants";
import { validateEIDASProofAttributes } from "../../libs/eidas";
import { EnterpriseWallet } from "../../libs/secureEnclave";
import * as config from "../../config";

export default class Controller {
  /**
   *
   * @param signPayload
   */
  static async EIDASsignature(
    signPayload: SignPayload
  ): Promise<EIDASSignatureOutput> {
    if (
      !signPayload ||
      !signPayload.issuer ||
      !signPayload.payload ||
      !signPayload.type
    )
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.SIGNATURE_BAD_PARAMS,
      });

    const { issuer, payload, type, expiresIn } = signPayload;

    if (type !== SignatureTypes.EidasSeal2019)
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.SIGNATURE_BAD_TYPE,
      });

    // sign with another keypair
    const jws: string = await EnterpriseWallet.signDidJwt(
      issuer,
      Buffer.from(JSON.stringify(payload)),
      expiresIn
    );
    if (!jws)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.ERROR_SIGNATURE_CREATION,
      });
    const vc: VerifiableCredential = {
      ...(payload as Credential),
      proof: {
        type,
        created: Controller.getIssuanceDate(jws),
        proofPurpose: DEFAULT_PROOF_PURPOSE,
        verificationMethod: `${issuer}${DEFAULT_EIDAS_VERIFICATION_METHOD}`,
        jws,
      } as Proof,
    };
    return {
      issuer,
      vc,
    };
  }

  /**
   *
   * @param proof
   */
  static async EIDASvalidateSignature(proof: Proof): Promise<VerifiedJwt> {
    if (
      !proof ||
      !proof.type ||
      !proof.created ||
      !proof.proofPurpose ||
      !proof.verificationMethod ||
      !proof.jws
    )
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.SIGNATURE_BAD_PARAMS,
      });
    if (proof.type !== SignatureTypes.EidasSeal2019)
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.SIGNATURE_BAD_TYPE,
      });

    validateEIDASProofAttributes(proof);
    const options: JWTVerifyOptions = {
      resolver: new Resolver(
        VidDidResolver.getResolver({
          rpcUrl: config.LEDGER.provider,
          registry: config.LEDGER.didRegistry,
        })
      ),
    };
    const result = await verifyJWT(proof.jws, options);
    if (!result)
      throw new InternalError(InternalError.defaultTitle, {
        detail: ApiErrorMessages.ERROR_VERIFYING_SIGNATURE,
      });
    return result;
  }

  static getIssuanceDate(jwt: string): string {
    const { payload } = decodeJWT(jwt);
    const iat = payload.iat ? payload.iat : new Date();
    const issuanceDate = new Date(iat).toISOString();
    return issuanceDate;
  }
}
