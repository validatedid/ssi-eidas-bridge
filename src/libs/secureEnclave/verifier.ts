import { decodeJwt, verifyJwt } from "did-jwt";
import * as config from "../../config";
import { PRINT_ERROR } from "../../utils/util";
import { ApiErrorMessages, BadRequestError } from "../../errors";
import ComponentSecureEnclave from "./componentSecureEnclave";
import { JWTVerifyOptions, VerifiedJwt } from "./jwt";

export default class Verifier {
  private static instance: Verifier;

  private resolver: string;

  private constructor(
    private iSecureEnclave: ComponentSecureEnclave = ComponentSecureEnclave.Instance
  ) {
    this.resolver = config.BRIDGE_DID_IDENTIFIERS;
  }

  static get Instance(): Verifier {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }

  /**
   * Verifies JWS signed using did-jwt library thus using ES256K-R.
   * Used for VCs and VPs.
   * @param data
   * @param options
   */
  async verifyVcJwt(
    data: string,
    inOptions?: JWTVerifyOptions
  ): Promise<VerifiedJwt> {
    let options = inOptions;
    if (options === undefined) {
      options = {
        resolver: this.resolver,
      };
    }
    const audience = Verifier.getAudience(data);
    if (audience) {
      // if audience it is a DID, it needs to be set as options audience
      if (audience.match(/^did:/)) {
        options.audience = audience;
      } else {
        // if audience it is not a DID, it needs to be set as a callback url
        options.callbackUrl = audience;
      }
    }
    try {
      const result = await verifyJwt(data, options);
      return result;
    } catch (error) {
      PRINT_ERROR(error);
      throw error;
    }
  }

  private static getAudience(jwt: string): string | undefined {
    const { payload } = decodeJwt(jwt);
    if (!payload)
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.NO_AUDIENCE,
      });
    if (!payload.aud) return undefined;
    if (Array.isArray(payload.aud))
      throw new BadRequestError(BadRequestError.defaultTitle, {
        detail: ApiErrorMessages.INVALID_AUDIENCE,
      });
    return payload.aud;
  }
}
