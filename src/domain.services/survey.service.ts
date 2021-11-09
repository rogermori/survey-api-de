import {
  updateStatus,
  createSurveys,
} from "../infrastructure.mongodb/models/survey";
import {
  findSurveyById,
  findSurveyByQuery,
} from "../infrastructure.mongodb/models/survey/aggregation";
import * as Types from "../infrastructure.mongodb/types";
import { queryToSurveyPipeline } from "../infrastructure.mongodb/utils";
import { simulateAnswerList } from "./survey.service.utils";

export const addSurveys = async (
  surveyInfo: Types.SurveyInfoInput[],
  userId: string
): Promise<Types.CreatedSurveyResponse> =>
  await createSurveys(surveyInfo, userId);

export const findOneSurvey = (id: string): Promise<any> => findSurveyById(id);

export const searchSurveys = (surveyQuery: Types.SurveyQuery): Promise<any> =>
  findSurveyByQuery(queryToSurveyPipeline(surveyQuery));

export const generateAsnwers = async (
  surveyQuery: Types.SurveyQuery
): Promise<any> => {
  const surveys = await findSurveyByQuery(queryToSurveyPipeline(surveyQuery));
  if (!surveys || surveys.length === 0) {
    return surveys;
  }
  return simulateAnswerList(surveys);
};

export const switchStatus = (
  batchId: string,
  close: boolean
): Promise<string> => updateStatus(batchId, close);
