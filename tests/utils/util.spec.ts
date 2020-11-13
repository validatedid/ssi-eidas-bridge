import { JWK } from "jose";
import * as util from "util";
import LOGGER from "../../src/logger";
import {
  PRINT_SILLY,
  generateKeys,
  toHex,
  PRINT_INFO,
  PRINT_DEBUG,
  PRINT_ERROR,
  prefixWith0x,
} from "../../src/utils/util";

describe("utils Test Suite", () => {
  it("should create a JWK key pair", () => {
    expect.assertions(2);
    const key = generateKeys();
    expect(key).toBeDefined();
    expect(JWK.isKey(key)).toBe(true);
  });

  it("should return an hex string encoded in base64", () => {
    expect.assertions(1);
    const input =
      "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAELyirt1/9cnZmMwV6V73HHmh8OHWcgNBUf/E4Os8cT2Uf+R3lW9hCiPm37f9ojCqoerhoGfoMgiNJIRhK+rDUfQ==";
    const expectedResult =
      "3056301006072a8648ce3d020106052b8104000a034200042f28abb75ffd72766633057a57bdc71e687c38759c80d0547ff1383acf1c4f651ff91de55bd84288f9b7edff688c2aa87ab86819fa0c82234921184afab0d47d";
    const result = toHex(input);
    expect(result).toMatch(expectedResult);
  });

  describe("print util functions suite", () => {
    it("should call LOGGER.log with info parameter", () => {
      expect.assertions(1);
      const data = { toPrint: "some random data" };
      const operation = "test operation";
      const mockLog = jest.spyOn(LOGGER, "log").mockImplementation();
      PRINT_INFO(data, operation);
      expect(mockLog).toHaveBeenCalledWith({
        message: util.inspect(data),
        level: "info",
        operation,
      });
      mockLog.mockRestore();
    });

    it("should call LOGGER.log with debug parameter", () => {
      expect.assertions(1);
      const data = { toPrint: "some random data" };
      const operation = "test operation";
      const mockLog = jest.spyOn(LOGGER, "log").mockImplementation();
      PRINT_DEBUG(data, operation);
      expect(mockLog).toHaveBeenCalledWith({
        message: util.inspect(data),
        level: "debug",
        operation,
      });
      mockLog.mockRestore();
    });

    it("should call LOGGER.log with silly parameter", () => {
      expect.assertions(1);
      const data = { toPrint: "some random data" };
      const operation = "test operation";
      const mockLog = jest.spyOn(LOGGER, "log").mockImplementation();
      PRINT_SILLY(data, operation);
      expect(mockLog).toHaveBeenCalledWith({
        message: JSON.parse(JSON.stringify(`\n${util.inspect(data)}`)),
        level: "silly",
        operation,
      });
      mockLog.mockRestore();
    });

    it("should call LOGGER.log with silly parameter passing a string", () => {
      expect.assertions(1);
      const data = "i am a string";
      const operation = "test operation";
      const mockLog = jest.spyOn(LOGGER, "log").mockImplementation();
      PRINT_SILLY(data, operation);
      expect(mockLog).toHaveBeenCalledWith({
        message: `\n${data}`,
        level: "silly",
        operation,
      });
      mockLog.mockRestore();
    });

    it("should call LOGGER.log", () => {
      expect.assertions(1);
      const error = {
        name: "HTTPError",
        Title: "error title",
        Status: 500,
        Detail: "error detail",
        message: "error message",
      };
      const operation = "test operation";
      const mockError = jest.spyOn(LOGGER, "error").mockImplementation();
      PRINT_ERROR(error, operation);
      expect(mockError).toHaveBeenCalledTimes(2);
      mockError.mockRestore();
    });

    it("should call LOGGER.log nonhttp", () => {
      expect.assertions(1);
      const error = {
        name: "other error",
        message: "error message",
      };
      const operation = "test operation";
      const mockError = jest.spyOn(LOGGER, "error").mockImplementation();
      PRINT_ERROR(error, operation);
      expect(mockError).toHaveBeenCalledTimes(2);
      mockError.mockRestore();
    });

    it("should call LOGGER.log with a non HTTPError with stack and response", () => {
      expect.assertions(1);
      const error = {
        name: "other error",
        message: "error message",
        response: "error response",
        stack: "error stack",
      };
      const operation = "test operation";
      const mockError = jest.spyOn(LOGGER, "error").mockImplementation();
      PRINT_ERROR(error, operation);
      expect(mockError).toHaveBeenCalledTimes(4);
      mockError.mockRestore();
    });

    it("should prefix the keys with 0x if they don't start with 0x", () => {
      expect.assertions(1);
      expect(prefixWith0x("fakekey")).toStrictEqual("0xfakekey");
    });

    it("should not prefix the keys with 0x if they already start with 0x", () => {
      expect.assertions(1);
      expect(prefixWith0x("0xfakekey")).toStrictEqual("0xfakekey");
    });
  });
});
