import { NextFunction, RequestHandler } from "express";
import httpStatus from "http-status";
import * as Service from "../domain.services/survey.service";
import { AppError } from "../infrastructure.express/lib/error.handler";
import { CreatedSurveyResponse } from "../infrastructure.mongodb/types";
import * as Utils from "./survey.controller.utils";
const { CREATED, OK } = httpStatus;

export const create: RequestHandler = async (req, res, next) => {
  // @ts-ignore: property not found
  const userId = req.userId;
  const createdSurveyResponse: CreatedSurveyResponse = await Service.addSurveys(
    req.body,
    userId
  );
  res.header(
    "location",
    Utils.createLocationHeader(createdSurveyResponse.batchId)
  );
  res.status(CREATED).json(Utils.createSurveyResponse(createdSurveyResponse));
};

export const updateStatus =
  (close: boolean): RequestHandler =>
  async (req, res, next) => {
    const batchId: string = await Service.switchStatus(
      req.params.batchId,
      close
    );
    const location = Utils.createLocationHeader(batchId);
    res.header("location", location);
    res.status(OK).json({ location });
  };

export const findById: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  const surveyId = req.params.surveyId;
  const survey = await Service.findOneSurvey(surveyId);
  if (survey) {
    return res.status(OK).json(survey);
  }
  next(new AppError(`Survey ${surveyId} not found`, httpStatus.NOT_FOUND));
};

export const findByQuery: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  const surveys = await Service.searchSurveys(req.query);
  return res.status(OK).json(surveys);
};
