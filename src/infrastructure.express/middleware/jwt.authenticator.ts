import express from "express";
import httpStatus from "http-status";
import njwt from "njwt";
import config from "../../config/configuration";
import logger from "../../config/winston.logger";
import { AppError } from "../lib/error.handler";

export const encodeToken = (tokenData: any) =>
  njwt.create(tokenData, config.secretKey).compact();
const decodeToken = (token: string) =>
  njwt.verify(token, config.secretKey).body;

// When a user is authenticated, this middleware attaches
// the userId to the req object
export const jwtAuthentication: express.RequestHandler = (
  req: any,
  _res,
  next
) => {
  const token = req.header("Access-Token");
  if (!token) {
    return next();
  }
  try {
    const { userId }: any = decodeToken(token);
    if (userId) req["userId"] = userId;
  } catch (error) {
    logger.error(error);
  }
  next();
};

// This middleware stops the request if a user is not authenticated.
export const isAuthenticated: express.RequestHandler = (
  req: any,
  res,
  next
) => {
  if (req.userId) {
    return next();
  }
  next(new AppError("user not authenticated", httpStatus.UNAUTHORIZED));
};
