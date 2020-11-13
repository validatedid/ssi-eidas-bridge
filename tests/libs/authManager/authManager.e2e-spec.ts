import http from "http";
import AuthManager from "../../../src/libs/authManager/authManager";
import { API_PRIVATE_KEY, WALLET, BRIDGE_SERVICE } from "../../../src/config";
import { startEbsiService } from "../../../src/api/app";
import ComponentSecureEnclave from "../../../src/libs/secureEnclave/componentSecureEnclave";

describe("authManager tests", () => {
  let server: http.Server;
  const testPort: number = 9900;

  // eslint-disable-next-line jest/no-hooks
  beforeAll(async (done) => {
    // launch Server to test its RESTful API
    server = await startEbsiService(
      BRIDGE_SERVICE.NAME.EIDAS,
      testPort,
      BRIDGE_SERVICE.SWAGGER_INTERNAL_URL.EIDAS
    );

    done();
  });

  // eslint-disable-next-line jest/no-hooks
  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  it("should create an authorization token", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    await se.init(API_PRIVATE_KEY);
    const payload = { data: "test sample data" };

    const token = await AuthManager.Instance.createAuthorizationToken(payload);
    expect(token).toBeDefined();
  });

  it("should create an authorization token with subject", async () => {
    expect.assertions(1);
    const se = ComponentSecureEnclave.Instance;

    await se.init(API_PRIVATE_KEY);
    const payload = { data: "test sample data" };

    const token = await AuthManager.Instance.createAuthorizationToken(
      payload,
      WALLET
    );
    expect(token).toBeDefined();
  });
});
