import { RequestHandler } from "express";
import { querySchema, validateResponseInfo } from "./response.validator.schema";
import {
  exactAnswerMatch,
  exactSurveyMatch,
} from "../../infrastructure.mongodb/models/survey/aggregation";
import { createBadRequestError, generateListWithKey } from "./validator.utils";
import { AppError } from "../lib/error.handler";
import httpStatus from "http-status";

export const create: RequestHandler = async (req, _res, next) => {
  // check valid payload
  const { error, value: sanitizedDoc } = validateResponseInfo(req.body);
  if (error) {
    return next(createBadRequestError(error));
  }
  const surveyIdList = generateListWithKey(req.body, "surveyId");
  const answerIdList = generateListWithKey(req.body, "answerId");

  // check existing surveys and answers
  const [isSurveyMatch, isAnswerMatch] = await Promise.all([
    exactSurveyMatch(surveyIdList),
    exactAnswerMatch(surveyIdList, answerIdList),
  ]);

  if (!isSurveyMatch) {
    return next(
      new AppError("survey(s) not found or closed", httpStatus.BAD_REQUEST)
    );
  }

  if (!isAnswerMatch) {
    return next(new AppError("answer(s) not found", httpStatus.BAD_REQUEST));
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
