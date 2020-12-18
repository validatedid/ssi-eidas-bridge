import { SignPayload } from "../../dtos/secureEnclave";
import {
  Credential,
  EidasProof,
  EIDASSignatureOutput,
  Proof,
  VerifiableCredential,
} from "../../dtos/eidas";
import { EidasKeysData, RedisInsertion } from "../../dtos/redis";
import { BadRequestError, ApiErrorMessages } from "../../errors";

import { isEidasProof, signEidas, verifyEidas } from "../../libs/eidas/eidas";
import redis from "../../libs/storage/redis";
import { KeyTypes } from "../../@types/constants";
import { isVerifiableCredential } from "../../utils/ssi";

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
   * @param verifiableCredential
   */
  static async EIDASvalidateSignature(
    verifiableCredential: VerifiableCredential
  ): Promise<void> {
    if (!isVerifiableCredential(verifiableCredential))
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.SIGNATURE_BAD_PARAMS,
      });
    const credential = (({ proof, ...o }) => o)(verifiableCredential);
    if (!Array.isArray(verifiableCredential.proof)) {
      if (!isEidasProof(verifiableCredential.proof))
        throw new BadRequestError(ApiErrorMessages.NO_EIDAS_PROOF);
      await verifyEidas(credential, verifiableCredential.proof as EidasProof);
    }
    if (Array.isArray(verifiableCredential.proof)) {
      const eidasProofs = verifiableCredential.proof.filter((proof) =>
        isEidasProof(proof)
      );
      if (eidasProofs.length <= 0)
        throw new BadRequestError(ApiErrorMessages.NO_EIDAS_PROOF);
      const resolves = eidasProofs.map(async (eidasProof) =>
        verifyEidas(credential, eidasProof as EidasProof)
      );
      await Promise.all(resolves);
    }
  }

  static async putEidasKeys(opts: EidasKeysData): Promise<RedisInsertion> {
    if (!opts || !opts.p12 || !opts.keyType || opts.keyType !== KeyTypes.RSA)
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.BAD_INPUT_EIDAS_KEYS_PARAMS,
      });
    const previousKeys = await redis.get(opts.did);
    await redis.set(opts.did, JSON.stringify(opts));
    return {
      eidasKeysData: opts,
      firstInsertion: !previousKeys,
    };
  }
}
