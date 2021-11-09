import { ObjectId } from "mongodb";

export interface AnswerInfo {
  surveyId?: ObjectId;
  answer: string;
  batchId?: string; // auto generated batch number at creation time
  numberOfResponses?: number; // incremented upon creation/update of a 'completed' answer
  updatedAt?: Date;
  createdAt?: Date;
}

export interface SurveyInfoInput {
  question: string;
  possibleAnswers: string[];
}

export interface SurveyInfo {
  _id: ObjectId;
  batchId: string; // auto generated batch number at creation time
  question: string;
  numberOfResponses: number;
  numberOfAnswers: number;
  status?: "open" | "closed"; // user can only answer open Surveys
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
}

type ResponseStatus = "pending" | "completed";
export interface ResponseInfo {
  contextId?: string; // user answer questions in a single contextId
  responseBatchId?: string; // auto generated batch number at creation or update time
  surveyId: ObjectId;
  answerId: ObjectId;
  response: string;
  updatedAt?: Date;
  createdAt?: Date;
  status: ResponseStatus; // completed answer update Survey and SurveyAnswer stats
}

export interface ResponseInfoInput {
  contextId?: string;
  surveyId: ObjectId;
  answerId: ObjectId;
  response: string;
  status: ResponseStatus;
}

export interface SurveyQuery {
  question?: string;
  batchId?: string;
  _limit?: number;
  _page?: number;
  _sort?: {
    question?: string;
  };
}

export interface ResponseQuery {
  surveyBatchId?: string;
  responseBatchId?: string;
  contextId?: string;
  _limit?: number;
  _page?: number;
}

export interface CreatedSurveyResponse {
  batchId: string;
  createdIds: ObjectId[];
}
