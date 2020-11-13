import httpMocks from "node-mocks-http";
import { decodeJwt } from "@cef-ebsi/did-jwt";
import axios from "axios";
import { EventEmitter } from "events";
import {
  GrantType,
  AccessTokenRequestBody,
  AccessTokenResponseBody,
  TokenType,
  IComponentAuthZToken,
} from "../../src/libs/secureEnclave/jwt";
import { testAuthNToken } from "../auxAPICalls";
import { API_NAME } from "../../src/config";

jest.setTimeout(1000000);

const invalidJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("auth middleware test suite", () => {
  it("should throw a BadRequestError with a body without Grant type", async () => {
    expect.assertions(3);
    const req = httpMocks.createRequest({
      method: "POST",
      baseUrl: "/sessions",
      body: {},
    });
    const res = httpMocks.createResponse();
    const next = (error?: any) => {
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
      expect(error.detail).toMatch(
        `grantType must be '${GrantType.jwtBearer}'`
      );
    };

    await auth.callNewSession(req, res, next);
  });

  it("should throw a BadRequestError when using body without assertion", async () => {
    expect.assertions(3);
    const req = httpMocks.createRequest({
      method: "POST",
      baseUrl: "/sessions",
      body: {
        grantType: GrantType.jwtBearer,
      },
    });
    const res = httpMocks.createResponse();
    const next = (error?: any) => {
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
      expect(error.detail).toMatch(`No assertion present in the body`);
    };

    await auth.callNewSession(req, res, next);
  }, 10000);

  it("should throw a JWTMalformed error", async () => {
    expect.assertions(3);
    const req = httpMocks.createRequest({
      method: "POST",
      baseUrl: "/sessions",
      body: {
        grantType: GrantType.jwtBearer,
        assertion: "invalid token",
      } as AccessTokenRequestBody,
    });
    const res = httpMocks.createResponse();
    const next = (error?: any) => {
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
      expect(error.detail).toMatch("The token can not be parsed");
    };
    await auth.callNewSession(req, res, next);
  });

  it("should throw a InvalidTokenError with an invalid jwt", async () => {
    expect.assertions(3);
    const req = httpMocks.createRequest({
      method: "POST",
      baseUrl: "/sessions",
      body: {
        grantType: GrantType.jwtBearer,
        assertion: invalidJWT,
      } as AccessTokenRequestBody,
    });
    const res = httpMocks.createResponse();
    const next = (error?: any) => {
      expect(error).toBeDefined();
      expect(error.status).toBe(400);
      expect(error.detail).toMatch(
        "Impossible to deduce scope: Invalid headers or payload"
      );
    };

    await auth.callNewSession(req, res, next);
  });

  it("should return a signed Component AuthZtoken", async () => {
    expect.assertions(3);
    const next = () => {};
    const req = httpMocks.createRequest({
      method: "POST",
      baseUrl: "/sessions",
      body: {
        grantType: GrantType.jwtBearer,
        assertion: (await testAuthNToken()).token,
      } as AccessTokenRequestBody,
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });
    const expectedResult: AccessTokenResponseBody = {
      accessToken: expect.any(String),
      tokenType: TokenType.bearer,
      expiresIn: expect.any(Number),
      issuedAt: expect.any(Number),
    };
    const expectedComponentAuthZ: IComponentAuthZToken = {
      iss: API_NAME,
      aud: API_NAME,
      iat: expect.any(Number),
      exp: expect.any(Number),
    };
    const mockedAxiosGet = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: {
          appName: "ebsi-eidas-bridge",
          pubKey:
            "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFvRFFnQUVMeWlydDEvOWNuWm1Nd1Y2VjczSEhtaDhPSFdjZ05CVQpmL0U0T3M4Y1QyVWYrUjNsVzloQ2lQbTM3ZjlvakNxb2VyaG9HZm9NZ2lOSklSaEsrckRVZlE9PQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=",
        },
      })
      .mockResolvedValueOnce({ data: {} });

    res.on("end", () => {
      // eslint-disable-next-line no-underscore-dangle
      const result: AccessTokenResponseBody = res._getData();
      expect(result).toMatchObject(expectedResult);
      const { payload } = decodeJwt(result.accessToken);
      expect(payload).toMatchObject(expectedComponentAuthZ);
      expect(mockedAxiosGet).toHaveBeenCalledTimes(2);
    });

    await auth.callNewSession(req, res, next);
  });
});
