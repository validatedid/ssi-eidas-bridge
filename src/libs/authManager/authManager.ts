import moment from "moment";
import * as config from "../../config";
import SecureEnclave from "../secureEnclave/secureEnclave";
import ComponentSecureEnclave from "../secureEnclave/componentSecureEnclave";

/**
 * Class to a SingleTon Class AuthManager
 */
export default class AuthManager {
  private static instance: AuthManager;

  /**
   * Create an instance of an AuthManager.
   * @param EBSIAPICred Authentication Credentials (user,pass)? to access protected EBSI API calls
   */
  private constructor(
    private secureEnclave: SecureEnclave = ComponentSecureEnclave.Instance
  ) {}

  /**
   * Returns an instance of the created AuthManager
   * Used when it is not known the constructor parameters, which
   * should be known only in the controller class
   */
  static get Instance() {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }

  async createAuthorizationToken(
    payload: any,
    subject?: string
  ): Promise<string> {
    const ebsiPayload = {
      ...payload,
      ...{
        sub: subject, // Should be the id of the app that is requesting the token
        iat: moment().unix(),
        exp: moment().add(15, "minutes").unix(),
        aud: config.API_NAME,
      },
    };

    const buffer = Buffer.from(JSON.stringify(ebsiPayload));

    const se = this.secureEnclave;

    const jwt = await se.signJwt(se.enclaveDid, buffer);
    return jwt;
  }
}
