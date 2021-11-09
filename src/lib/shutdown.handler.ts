import { Server } from "http";
import logger from "../config/winston.logger";

export function shutdown(signal: string, serverRef: () => Server) {
  return (err: Error) => {
    const server = serverRef();
    logger.info(`Received signal: ${signal}`);
    if (err) logger.error(err);
    if (server) {
      server.close(() => {
        logger.info("Server closed");
        process.exit(err ? 1 : 0);
      });
    } else {
      process.exit(err ? 1 : 0);
    }
  };
}
