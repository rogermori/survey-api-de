import { ObjectId } from "mongodb";
import config from "../config/configuration";
import { CreatedSurveyResponse } from "../infrastructure.mongodb/types";

export const createLocationHeader = (batchId: string) =>
  `/${config.api.version["2021-11-01"]}/surveys?batchId=${batchId}`;

const createSurveyLocation = (surveyId: ObjectId) =>
  `/${config.api.version["2021-11-01"]}/survey/${surveyId}`;

export const createSurveyResponse = (
  createdSurveyResponse: CreatedSurveyResponse
) => ({
  location: createLocationHeader(createdSurveyResponse.batchId),
  createdSurveys: createdSurveyResponse.createdIds.map((surveyId) => ({
    surveyId,
    location: createSurveyLocation(surveyId),
  })),
});
