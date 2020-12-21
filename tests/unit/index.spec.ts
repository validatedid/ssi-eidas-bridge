import httpMocks from "node-mocks-http";
import { EventEmitter } from "events";
import { handleError } from "../../src/errors";
import LOGGER from "../../src/logger";

describe("handleError middleware", () => {
  it("should call res.json with a 500 Error", () => {
    expect.assertions(2);
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    const err = new Error("Text error: 400");

    const next = jest.fn();
    jest.spyOn(res, "json").mockImplementation();
    handleError(err, req, res, next);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      detail: "Text error: 400",
      status: 500,
      title: "Internal Server Error",
      type: "about:blank",
    });
  });

  it("should print values with BRIDGE_ENV set to local", () => {
    expect.assertions(1);
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    const err = new Error("Sample");
    const next = jest.fn();
    jest.spyOn(LOGGER, "error").mockImplementation();

    process.env.BRIDGE_ENV = "local";
    handleError(err, req, res, next);
    process.env.BRIDGE_ENV = "test";

    expect(LOGGER.error).toHaveBeenCalledTimes(1);
  });

  it("should NOT print values with BRIDGE_ENV set to test", () => {
    expect.assertions(1);
    process.env.BRIDGE_ENV = "test";
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    const err = new Error("Sample");
    const next = jest.fn();
    jest.spyOn(LOGGER, "error").mockImplementation();

    handleError(err, req, res, next);

    expect(LOGGER.error).toHaveBeenCalledTimes(2);
  });
});
