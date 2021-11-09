import { ObjectId } from "mongodb";
import { Survey, SurveyAnswer } from "./index";

export const commonPipeline = [
  {
    $lookup: {
      from: "surveyanswers",
      let: {
        surveyId: "$_id",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$$surveyId", "$surveyId"],
            },
          },
        },
        {
          $project: {
            _id: 0,
            answerId: "$_id",
            answer: 1,
            numberOfResponses: 1,
            updatedAt: 1,
          },
        },
      ],
      as: "possibleAnswers",
    },
  },
  {
    $lookup: {
      from: "surveyresponses",
      let: {
        surveyId: "$_id",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$$surveyId", "$surveyId"],
            },
          },
        },
        {
          $project: {
            _id: 0,
            responseId: "$_id",
            contextId: 1,
            responseBatchId: "$batchId",
            answerId: 1,
            response: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
      as: "responses",
    },
  },
  {
    $project: {
      _id: 0,
      surveyId: "$_id",
      batchId: 1,
      question: 1,
      status: 1,
      numberOfAnswers: 1,
      numberOfResponses: 1,
      possibleAnswers: 1,
      responses: 1,
      createdAt: 1,
      updatedAt: 1,
      createdBy: 1,
    },
  },
];

export async function findSurveyById(surveyId: string): Promise<any> {
  return await Survey()
    .aggregate(
      [
        {
          $match: {
            _id: new ObjectId(surveyId),
          },
        },
        ...commonPipeline,
      ],
      {
        allowDiskUse: false,
      }
    )
    .toArray()
    .then((userList: any[]) => (userList.length ? userList[0] : null));
}

export const findSurveyByQuery = (pipeline: any[]) =>
  Survey().aggregate(pipeline).toArray();

export const exactSurveyMatch = (surveyIdList: string[]) =>
  Survey()
    .aggregate([
      {
        $match: {
          _id: { $in: surveyIdList.map((id) => new ObjectId(id)) },
          status: "open",
        },
      },
      { $project: { _id: 1 } },
    ])
    .toArray()
    .then(
      (idResponseList: any[]) => idResponseList.length === surveyIdList.length
    );

export const exactAnswerMatch = (
  surveyIdList: string[],
  answerIdList: string[]
) =>
  SurveyAnswer()
    .aggregate([
      {
        $match: {
          _id: { $in: answerIdList.map((id) => new ObjectId(id)) },
          surveyId: { $in: surveyIdList.map((id) => new ObjectId(id)) },
        },
      },
      { $project: { _id: 1, surveyId: 1 } },
    ])
    .toArray()
    .then(
      (idResponseList: any[]) => idResponseList.length === surveyIdList.length
    );
