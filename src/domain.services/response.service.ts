import {
  ResponseInfo,
  ResponseInfoInput,
  SurveyQuery,
} from "../infrastructure.mongodb/types";
import { createContextResponses } from "../infrastructure.mongodb/models/response";
import { findResponsesByQuery } from "../infrastructure.mongodb/models/response/aggregation";

export const addReponses = (
  contextId: string,
  responseInfoInput: ResponseInfoInput[]
) => {
  const responseInfoList = responseInfoInput.map(
    (responseInfo: ResponseInfoInput) => ({
      ...responseInfo,
      ...{ contextId },
    })
  ) as ResponseInfo[];
  return createContextResponses(responseInfoList);
};

export const searchResponses = async (surveyQuery: SurveyQuery) =>
  findResponsesByQuery(surveyQuery);
