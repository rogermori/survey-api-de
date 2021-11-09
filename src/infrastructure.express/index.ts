import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import httpStatus from "http-status";
import config from "../config/configuration";
import morgan from "../config/morgan.logger";
import { AppError, errorHandler } from "./lib/error.handler";
import { jwtAuthentication } from "./middleware/jwt.authenticator";
import createRouter from "./router";

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// Attach user to request
app.use(jwtAuthentication);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request payload
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

const router20211101 = createRouter(app);
app.use(config.api.version["2021-11-01"], router20211101);

// 404 error for any unknown api request
app.use((req, _res, next) => {
  next(new AppError(`${req.originalUrl} not found`, httpStatus.NOT_FOUND));
});

// Return JSON error
app.use(errorHandler);

export default app;
