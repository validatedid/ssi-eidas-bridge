import http from "http";
import net from "net";
import { BRIDGE_SERVICE } from "../../src/config";
import App, { startService } from "../../src/api/app";
import { ApiErrorMessages, ServiceUnavailableError } from "../../src/errors";
import redis from "../../src/libs/storage/redis";

describe("app test suite", () => {
  afterAll(async () => {
    await redis.quit();
  });

  const testPort = 9100;
  it("should throw an exception creating an APP with an unknown service", () => {
    expect.assertions(1);
    expect(() => {
      // eslint-disable-next-line no-new
      new App("");
    }).toThrow(
      new ServiceUnavailableError(ServiceUnavailableError.defaultTitle, {
        detail: ApiErrorMessages.NO_BRIDGE_SERVICE_AVAILABLE,
      })
    );
  });

  test.each`
    service                      | port
    ${BRIDGE_SERVICE.NAME.EIDAS} | ${testPort}
  `(
    "should start EBSI service $service at $port port",
    async ({ service, port }) => {
      const app = new App(service);
      expect(app).toBeInstanceOf(App);

      const server = await app.Start(port);
      expect(server).toBeInstanceOf(http.Server);
      expect((server.address() as net.AddressInfo).port).toBe(port);

      server.close();
    }
  );

  it("should call startService", async () => {
    expect.hasAssertions();

    const server = await startService(
      BRIDGE_SERVICE.NAME.EIDAS,
      testPort + 3,
      BRIDGE_SERVICE.SWAGGER_INTERNAL_URL.EIDAS
    );
    expect(server).toBeInstanceOf(http.Server);
    expect((server.address() as net.AddressInfo).port).toBe(testPort + 3);
    server.close();
  });
});
