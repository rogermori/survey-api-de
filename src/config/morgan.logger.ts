import morgan from "morgan";
import logger from "./winston.logger";

const successHandler = morgan("short", {
  skip: (_req, res) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan("combined", {
  skip: (_req, res) => res.statusCode < 400,
  stream: { write: (message: string) => logger.error(message.trim()) },
});

export default {
  successHandler,
  errorHandler,
};
