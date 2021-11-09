import { response } from "express";
import { ObjectId } from "mongodb";
import { ResponseQuery } from "../../types";
import { SurveyResponse } from "./index";

const surveyPipeline = [
  {
    $lookup: {
      from: "surveys",
      localField: "surveyId",
      foreignField: "_id",
      as: "survey",
    },
  },
  {
    $unwind: {
      path: "$survey",
      preserveNullAndEmptyArrays: false,
    },
  },
];

const projectPipeline = [
  {
    $project: {
      _id: 0,
      responseId: "$_id",
      surveyId: 1,
      answerId: 1,
      contextId: 1,
      batchId: 1,
      question: "$survey.question",
      surveyBatchId: "$survey.batchId",
      response: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

export const findResponsesByQuery = (
  responseQuery: ResponseQuery
): Promise<any> => {
  return SurveyResponse()
    .aggregate(_queryToSurveyPipeline(responseQuery))
    .toArray();
};

function _queryToSurveyPipeline({
  responseBatchId,
  contextId,
  surveyBatchId,
  _limit,
  _page,
}: ResponseQuery) {
  const aggPipeline = [];
  if (responseBatchId || contextId) {
    const match: any = {
      $match: {},
    };
    if (responseBatchId) {
      match.$match["responseBatchId"] = responseBatchId;
    }
    if (contextId) {
      match.$match["contextId"] = contextId;
    }

    aggPipeline.push(match);
  }
  if (!surveyBatchId) {
    aggPipeline.push(
      {
        $limit: _limit,
      },
      {
        $skip: _limit * _page,
      }
    );

    return [...aggPipeline, ...surveyPipeline, ...projectPipeline];
  }
  return [
    ...aggPipeline,
    ...surveyPipeline,
    ...[
      { $match: { "survey.batchId": surveyBatchId } },
      {
        $limit: _limit,
      },
      {
        $skip: _limit * _page,
      },
    ],
    ...projectPipeline,
  ];
}
