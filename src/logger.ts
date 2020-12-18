import { createLogger, format, transports } from "winston";
import { TransformableInfo } from "logform";
import * as config from "./config";

interface InfoPrint extends TransformableInfo {
  timestamp: string;
}

const LOGGER = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) =>
        `${(info as InfoPrint).timestamp} ${info.level} [${config.API_NAME}]: ${
          info.message
        }`
    )
  ),
  transports: [
    new transports.Console({
      // change level if in dev environment versus production
      level: config.LOG_LEVEL,
    }),
  ],
  // If false, handled exceptions will not cause process.exit
  exitOnError: false,
});

export default LOGGER;
