import { decodeJWT, verifyJWT } from "did-jwt";
import VidDidResolver from "@validatedid/vid-did-resolver";
import { Resolver } from "did-resolver";
import { SignPayload } from "../../dtos/secureEnclave";
import {
  Credential,
  EIDASSignatureOutput,
  VerifiableCredential,
} from "../../dtos/eidas";
import { RedisInsertion } from "../../dtos/redis";
import { BadRequestError, InternalError, ApiErrorMessages } from "../../errors";
import { Proof } from "../../libs/eidas/types";
import {
  JWTVerifyOptions,
  SignatureTypes,
  VerifiedJwt,
} from "../../libs/secureEnclave/jwt";

import { validateEIDASProofAttributes } from "../../libs/eidas";
import * as config from "../../config";
import { EidasKeysOptions } from "../../dtos/keys";
import { signEidas } from "../../libs/eidas/eidas";
import redis from "../../libs/storage/redis";

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
    const { issuer, payload } = signPayload;

    // sign with another keypair
    const eidasProof = await signEidas(signPayload);

    let proofs: Proof[] = [];
    if (Array.isArray(payload.proof)) {
      proofs = payload.proof as Proof[];
      proofs.push(eidasProof);
    }
    if (payload.proof && !Array.isArray(payload.proof)) {
      proofs.push(payload.proof as Proof);
      proofs.push(eidasProof);
    }
    const vc: VerifiableCredential = {
      ...(payload as Credential),
      proof: proofs && proofs.length > 0 ? proofs : eidasProof,
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

  static async putEidasKeys(opts: EidasKeysOptions): Promise<RedisInsertion> {
    if (
      !opts ||
      !opts.did ||
      !opts.eidasKey ||
      !opts.keyType ||
      !["RSA", "EC", "OKP"].includes(opts.keyType) ||
      (opts.keyType === ("EC" || "OKP") && !opts.curveType)
    )
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.BAD_INPUT_EIDAS_KEYS_PARAMS,
      });
    const previousKeys = await redis.get(opts.did);
    await redis.set(opts.did, opts.eidasKey);
    return {
      eidasKey: opts.eidasKey,
      firstInsertion: !previousKeys,
    };
  }
}
