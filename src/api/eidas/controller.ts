import { SignPayload } from "../../dtos/secureEnclave";
import {
  Credential,
  EidasProof,
  Proof,
  VerifiableCredential,
} from "../../dtos/eidas";
import {
  EidasKeysData,
  EidasKeysInput,
  RedisInsertion,
} from "../../dtos/redis";
import { ApiErrorMessages, BadRequestError } from "../../errors";

import { isEidasProof, signEidas, verifyEidas } from "../../libs/eidas/eidas";
import redis from "../../libs/storage/redis";
import { isVerifiableCredential, isCredential } from "../../utils/ssi";
import { indication } from "../../dtos";
import { DssVerificationOutput } from "../../dtos/dss";

export default class Controller {
  /**
   *
   * @param signPayload
   */
  static async EIDASsignature(
    signPayload: SignPayload
  ): Promise<VerifiableCredential> {
    if (
      !signPayload ||
      !signPayload.issuer ||
      !signPayload.payload ||
      !signPayload.password ||
      !isCredential(signPayload.payload)
    )
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.SIGNATURE_BAD_PARAMS,
      });
    const { payload } = signPayload;
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
    return vc;
  }

  /**
   *
   * @param verifiableCredential
   */
  static async EIDASvalidateSignature(
    verifiableCredential: VerifiableCredential
  ): Promise<DssVerificationOutput[]> {
    let dssVerificationOutput: DssVerificationOutput[];

    if (!isVerifiableCredential(verifiableCredential))
      throw new BadRequestError(indication.VERIFICATION_FAIL, {
        detail: ApiErrorMessages.BAD_VERIFIABLE_CREDENTIAL,
      });
    const credential = (({ proof, ...o }) => o)(verifiableCredential);
    if (!Array.isArray(verifiableCredential.proof)) {
      if (!isEidasProof(verifiableCredential.proof))
        throw new BadRequestError(indication.VERIFICATION_FAIL, {
          detail: ApiErrorMessages.NO_EIDAS_PROOF,
        });

      dssVerificationOutput = [
        await verifyEidas(credential, verifiableCredential.proof as EidasProof),
      ];
    }
    if (Array.isArray(verifiableCredential.proof)) {
      const eidasProofs = verifiableCredential.proof.filter((proof) =>
        isEidasProof(proof)
      );
      if (eidasProofs.length <= 0)
        throw new BadRequestError(indication.VERIFICATION_FAIL, {
          detail: ApiErrorMessages.NO_EIDAS_PROOF,
        });
      const resolves = eidasProofs.map(async (eidasProof) =>
        verifyEidas(credential, eidasProof as EidasProof)
      );
      dssVerificationOutput = await Promise.all(resolves);
    }

    return dssVerificationOutput;
  }

  static async putEidasKeys(
    eidasQecId: string,
    opts: EidasKeysInput
  ): Promise<RedisInsertion> {
    if (!opts || !opts.did || !opts.eidasQec || !opts.did.startsWith("did:"))
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.BAD_INPUT_EIDAS_KEYS_PARAMS,
      });
    if (!eidasQecId)
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.MISSING_PUT_ID_PARAMS,
      });
    const previousKeys = await redis.get(opts.did);
    const eidasKeysData: EidasKeysData = {
      ...opts,
      eidasQecId,
    };
    await redis.set(opts.did, JSON.stringify(eidasKeysData));

    return {
      id: opts.did,
      firstInsertion: !previousKeys,
    };
  }
}
