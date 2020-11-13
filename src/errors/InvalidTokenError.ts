import { BadRequestError } from "@cef-ebsi/problem-details-errors";

class InvalidTokenError extends BadRequestError {
  constructor(detail: string) {
    super("Invalid Token", { detail });
  }
}

export default InvalidTokenError;
