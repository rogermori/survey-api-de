import { RequestHandler } from "express";
import { querySchema, validateSurveyInfo } from "./survey.validator.schema";
import { createBadRequestError } from "./validator.utils";

export const create: RequestHandler = (req, _res, next) => {
  const { error, value: sanitizedDoc } = validateSurveyInfo(req.body);
  if (error) {
    throw createBadRequestError(error);
  }
  req.body = sanitizedDoc;
  next();
};

export const validateQuery: RequestHandler = (req, _res, next) => {
  const { error, value: sanitizedQuery } = querySchema.validate(req.query);
  if (error) {
    throw createBadRequestError(error);
  }
  req.query = sanitizedQuery;
  next();
};
