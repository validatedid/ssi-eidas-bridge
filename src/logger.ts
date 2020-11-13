import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import fs from "fs";
import path from "path";
import { LOG_LEVEL } from "./config";

const logDir = "log";

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateInfoFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: "YYYY-MM-DD",
  level: "info",
  format: format.combine(
    format.label({
      label: path.basename(require.main ? require.main.filename : ""),
    }),
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  ),
});

const dailyRotateErrorFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-error.log`,
  datePattern: "YYYY-MM-DD",
  level: "error",
});

const LOGGER = createLogger({
  format: format.combine(
    format.label({
      label: path.basename(require.main ? require.main.filename : ""),
    }),
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  ),
  transports: [
    new transports.Console({
      // change level if in dev environment versus production
      level: LOG_LEVEL,
    }),
    dailyRotateInfoFileTransport,
    dailyRotateErrorFileTransport,
  ],
  // If false, handled exceptions will not cause process.exit
  exitOnError: false,
});

export default LOGGER;
