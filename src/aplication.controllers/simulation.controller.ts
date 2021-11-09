import { NextFunction, RequestHandler } from "express";
import httpStatus from "http-status";
import * as SurveyService from "../domain.services/survey.service";
import { AppError } from "../infrastructure.express/lib/error.handler";
import { generateRandomSurveys } from "../lib/survey.util";
const { OK } = httpStatus;

export const generateAsnwers: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  const surveys = await SurveyService.generateAsnwers(req.query);
  if (surveys && surveys.length > 0) {
    return res.status(OK).json(surveys);
  }
  next(new AppError("Surveys not found", httpStatus.NOT_FOUND));
};

export const generateSurveys: RequestHandler = async (
  _req,
  res,
  next: NextFunction
) => res.status(OK).json(generateRandomSurveys());
