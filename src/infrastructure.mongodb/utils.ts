import { SurveyQuery } from "./types";
import { commonPipeline } from "./models/survey/aggregation";

export function queryToSurveyPipeline(surveyQuery: SurveyQuery) {
  const aggPipeline = [];
  if (surveyQuery.question || surveyQuery.batchId) {
    const match: any = {
      $match: {},
    };
    if (surveyQuery.question) {
      match.$match["question"] = surveyQuery.question;
    }
    if (surveyQuery.batchId) {
      match.$match["batchId"] = surveyQuery.batchId;
    }

    aggPipeline.push(match);
  }

  aggPipeline.push(
    {
      $limit: surveyQuery._limit,
    },
    {
      $skip: surveyQuery._limit * surveyQuery._page,
    }
  );
  aggPipeline.push({
    $sort: _createSortStage(surveyQuery),
  });

  return [...aggPipeline, ...commonPipeline];
}

function _createSortStage(surveyQuery: SurveyQuery) {
  return Object.keys(surveyQuery._sort).reduce((a: any, key: any) => {
    a[key] = (surveyQuery._sort as any)[key] === "ASC" ? 1 : -1;
    return a;
  }, {});
}

export const isValidMongoId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export const isJoiValidMongoId = (value: any, helper: any) =>
  isValidMongoId(value)
    ? value
    : helper.message('"{{#label}}" must be a valid mongo id');
