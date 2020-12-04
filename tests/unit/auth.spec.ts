import httpMocks from "node-mocks-http";
import axios from "axios";
import BRIDGE_JWT from "@cef-ebsi/app-jwt";
import { EventEmitter } from "events";
import * as auth from "../../src/middleware/auth";
import {
  GrantType,
  AccessTokenRequestBody,
  AccessTokenResponseBody,
  TokenType,
} from "../../src/libs/secureEnclave/jwt";
import * as config from "../../src/config";
import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from "../../src/errors";

describe("auth middleware unit testing suite", () => {
  describe("auth callNewSession test suite", () => {
    it("should return a signed Component AuthZtoken", async () => {
      expect.assertions(2);
      const next = () => {};
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/sessions",
        body: {
          grantType: GrantType.jwtBearer,
          assertion: "token1",
        } as AccessTokenRequestBody,
      });
      const res = httpMocks.createResponse({
        eventEmitter: EventEmitter,
      });
      const expectedNewSessionResult = {
        accessToken: "a sample token",
        tokenType: TokenType.bearer,
        expiresIn: Date.now() + 900,
        issuedAt: Date.now(),
      };
      jest
        .spyOn(BRIDGE_JWT.Session.prototype, "newSession")
        .mockResolvedValue(expectedNewSessionResult);
      const expectedResult: AccessTokenResponseBody = {
        accessToken: expect.any(String),
        tokenType: TokenType.bearer,
        expiresIn: expect.any(Number),
        issuedAt: expect.any(Number),
      };
      const mockedAxiosGet = jest
        .spyOn(axios, "get")
        .mockResolvedValueOnce({
          data: {
            appName: "ssi-eidas-bridge",
            pubKey:
              "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFvRFFnQUVMeWlydDEvOWNuWm1Nd1Y2VjczSEhtaDhPSFdjZ05CVQpmL0U0T3M4Y1QyVWYrUjNsVzloQ2lQbTM3ZjlvakNxb2VyaG9HZm9NZ2lOSklSaEsrckRVZlE9PQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=",
          },
        })
        .mockResolvedValueOnce({ data: {} });

      res.on("end", () => {
        // eslint-disable-next-line no-underscore-dangle
        const result: AccessTokenResponseBody = res._getData();
        expect(result).toMatchObject(expectedResult);
        expect(mockedAxiosGet).toHaveBeenCalledTimes(2);
      });

      await auth.callNewSession(req, res, next);
      jest.resetAllMocks();
    });
  });

  describe("handleToken test suite", () => {
    it("should return a signed component session", async () => {
      expect.assertions(1);
      const agent = new BRIDGE_JWT.Agent(config.API_NAME, config.API_PRIVATE_KEY);
      const payload = agent.createRequestPayload(config.API_NAME);
      const next = () => {};
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/sessions",
        body: payload as any,
      });
      const res = httpMocks.createResponse({
        eventEmitter: EventEmitter,
      });
      const expectedResult = {
        accessToken: "a sample token",
        tokenType: TokenType.bearer,
        expiresIn: Date.now() + 900,
        issuedAt: Date.now(),
      };
      res.on("end", () => {
        // eslint-disable-next-line no-underscore-dangle
        const result = res._getData();
        expect(result).toMatchObject(expectedResult);
      });
      jest
        .spyOn(BRIDGE_JWT.Session.prototype, "newSession")
        .mockResolvedValue(expectedResult);
      await auth.callNewSession(req, res, next);
      jest.resetAllMocks();
    }, 10000);

    it("should throw an error while creating a new session", async () => {
      expect.assertions(2);
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/sessions",
        body: {},
      });
      const res = httpMocks.createResponse();
      const next = (error?: any) => {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toStrictEqual("Internal Error");
      };
      jest
        .spyOn(BRIDGE_JWT.Session.prototype, "newSession")
        .mockRejectedValue(new Error("Internal Error"));
      await auth.callNewSession(req, res, next);
      jest.resetAllMocks();
    }, 10000);

    it("should return an authenticated session", async () => {
      expect.assertions(1);
      const next = () => {};
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: { Authorization: `Bearer ${"aaaaaaTOKEN"}` },
      });
      const res = httpMocks.createResponse();
      const tokenDecoded = {
        aud: config.WALLET,
      };

      jest
        .spyOn(BRIDGE_JWT.TrustedAppRegistry.prototype, "verify")
        .mockResolvedValue(tokenDecoded);

      await auth.handleToken(req, res, next);
      expect(req.params.authenticated).toBe(true);
      jest.resetAllMocks();
    });

    it("should return an authenticated session false", async () => {
      expect.assertions(1);
      const next = () => {};
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: { Authorization: `Bearer ` },
      });
      const res = httpMocks.createResponse();
      await auth.handleToken(req, res, next);
      expect(req.params.authenticated).toBe(false);
      jest.resetAllMocks();
    });

    it("should return an authenticated session false with no authorization", async () => {
      expect.assertions(1);
      const next = () => {};
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: {},
      });
      const res = httpMocks.createResponse();
      await auth.handleToken(req, res, next);
      expect(req.params.authenticated).toBe(false);
      jest.resetAllMocks();
    });

    it("should throw an invalidtoken when no aud correct is set", async () => {
      expect.assertions(3);
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: { Authorization: `Bearer ${"aaaaaaTOKEN"}` },
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(BRIDGE_JWT.TrustedAppRegistry.prototype, "verify")
        .mockResolvedValue({
          aud: "another audience",
        });
      const next = (error?: any) => {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(BadRequestError);
        expect((error as BadRequestError).detail).toStrictEqual(
          "Token with incorrect audience. Please create a new session with 'ssi-eidas-bridge'"
        );
      };
      await auth.handleToken(req, res, next);
      jest.resetAllMocks();
    }, 1000000);

    it("should throw a TrustedAppNotFoundError", async () => {
      expect.assertions(4);
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: { Authorization: `Bearer ${"aaaaaaTOKEN"}` },
      });
      const res = httpMocks.createResponse();

      const spy = jest
        .spyOn(BRIDGE_JWT.TrustedAppRegistry.prototype, "verify")
        .mockRejectedValue(
          new InternalError(InternalError.defaultTitle, {
            detail: "Issuer Not Found",
          })
        );

      const next = (error?: any) => {
        expect(spy).toHaveBeenCalledWith("aaaaaaTOKEN");
        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(error.detail).toStrictEqual("Issuer Not Found");
      };
      await auth.handleToken(req, res, next);
      jest.resetAllMocks();
    });

    it("should throw a TrustedAppNotFoundError with status < 500", async () => {
      expect.assertions(4);
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: { Authorization: `Bearer ${"aaaaaaTOKEN"}` },
      });
      const res = httpMocks.createResponse();

      const spy = jest
        .spyOn(BRIDGE_JWT.TrustedAppRegistry.prototype, "verify")
        .mockRejectedValue(
          new BadRequestError(BadRequestError.defaultTitle, {
            detail: "some error",
          })
        );
      const next = (error?: any) => {
        expect(spy).toHaveBeenCalledWith("aaaaaaTOKEN");
        expect(error).toBeDefined();
        expect(error.status).toBe(400);
        expect(error.detail).toStrictEqual("some error");
      };
      await auth.handleToken(req, res, next);
      jest.resetAllMocks();
    });

    it("should throw a TrustedAppNotFoundError with no pubkey", async () => {
      expect.assertions(4);
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: { Authorization: `Bearer ${"aaaaaaTOKEN"}` },
      });
      const res = httpMocks.createResponse();
      const spy = jest
        .spyOn(BRIDGE_JWT.TrustedAppRegistry.prototype, "verify")
        .mockRejectedValue(
          new NotFoundError(NotFoundError.defaultTitle, {
            detail: "Issuer Not Found",
          })
        );
      const next = (error?: any) => {
        expect(spy).toHaveBeenCalledWith("aaaaaaTOKEN");
        expect(error).toBeDefined();
        expect(error.status).toBe(404);
        expect(error.detail).toStrictEqual("Issuer Not Found");
      };
      await auth.handleToken(req, res, next);

      jest.resetAllMocks();
    });

    it("should throw a InvalidTokenError on verify token", async () => {
      expect.assertions(4);
      const req = httpMocks.createRequest({
        method: "POST",
        baseUrl: "/a-simple-call",
        headers: { Authorization: `Bearer ${"aaaaaaTOKEN"}` },
      });
      const res = httpMocks.createResponse();
      const spy = jest
        .spyOn(BRIDGE_JWT.TrustedAppRegistry.prototype, "verify")
        .mockRejectedValue(
          new BadRequestError(BadRequestError.defaultTitle, {
            detail: "error on verify",
          })
        );
      const next = (error?: any) => {
        expect(spy).toHaveBeenCalledWith("aaaaaaTOKEN");
        expect(error).toBeDefined();
        expect(error.status).toBe(400);
        expect(error.detail).toStrictEqual("error on verify");
      };
      await auth.handleToken(req, res, next);
      jest.resetAllMocks();
    });
  });
});
