import { RequestHandler } from "express";
import httpStatus from "http-status";
import { isValidMongoId } from "../../infrastructure.mongodb/utils";
import { AppError } from "../lib/error.handler";

export const validDocumentId =
  (id: any): RequestHandler =>
  async (req, res, next) => {
    if (!isValidMongoId(req.params[id])) {
      throw new AppError("Invalid document Id", httpStatus.BAD_REQUEST);
    }
    next();
  };
