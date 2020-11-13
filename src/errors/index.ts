import { errorHandler } from "@cef-ebsi/express-problem-details";
import {
  InternalServerError as InternalError,
  UnauthorizedError,
  ServiceUnavailableError,
  BadRequestError,
  NotFoundError,
  ProblemDetailsError,
} from "@cef-ebsi/problem-details-errors";
import InvalidTokenError from "./InvalidTokenError";
import { ApiErrorMessages } from "./errorCodes";
import LOGGER from "../logger";

const handleError = errorHandler((normalizedError: any, originalError: any) => {
  if (originalError) {
    // Axios error
    if (originalError.response)
      LOGGER.error(JSON.stringify(originalError.response.data));
    LOGGER.error(originalError.stack);
  }
  LOGGER.info(
    `Error ${normalizedError.status} ${normalizedError.title}: ${normalizedError.detail}`
  );
});

export {
  handleError,
  BadRequestError,
  InternalError,
  UnauthorizedError,
  ServiceUnavailableError,
  ApiErrorMessages,
  NotFoundError,
  ProblemDetailsError,
  InvalidTokenError,
};
