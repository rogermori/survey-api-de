import { Server } from "http";
import config from "./config/configuration";
import logger from "./config/winston.logger";
import app from "./infrastructure.express";
import { shutdown } from "./lib/shutdown.handler";
import { mongoClient } from "./infrastructure.mongodb/connect";

let server: Server = null;

// configure exit handlers
config.signals.map((signal) =>
  process.on(
    signal,
    shutdown(signal, () => server)
  )
);

mongoClient.connect().then(() => {
  logger.info("Application connected to MongoDB");
  server = app.listen(config.port, () => {
    logger.info(`Server listens at ${config.hostname}`);
  });
});
