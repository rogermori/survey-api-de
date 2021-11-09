import { ObjectId } from "mongodb";
import { SurveyAnswer } from "./index";
import { AnswerInfo, SurveyInfo, SurveyInfoInput } from "../../types";

// Builds an array of survey documents and a bulk operation
// for creating survey answers
export class SurveyParametersFactory {
  surveys: SurveyInfoInput[];
  batchId: string;
  userId: string;

  //Output attributes
  surveyDocs: any[] = [];
  surveyAnswerBulk = SurveyAnswer().initializeOrderedBulkOp();

  constructor(surveys: SurveyInfoInput[], batchId: string, userId: string) {
    this.surveys = surveys;
    this.batchId = batchId;
    this.userId = userId;
    this.build();
  }

  build() {
    for (const survey of this.surveys) {
      const surveyId = new ObjectId();
      this.surveyDocs.push(this.mapToSurvey(surveyId, survey));
      for (const answer of survey.possibleAnswers) {
        this.surveyAnswerBulk.insert(this.mapToAnswer(surveyId, answer));
      }
    }
  }

  mapToSurvey(
    surveyId: ObjectId,
    { question, possibleAnswers }: SurveyInfoInput
  ): SurveyInfo {
    return {
      _id: surveyId,
      batchId: this.batchId,
      question,
      numberOfResponses: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      numberOfAnswers: possibleAnswers.length,
      status: "open",
      createdBy: this.userId,
    };
  }

  mapToAnswer(surveyId: ObjectId, answer: any): AnswerInfo {
    return {
      batchId: this.batchId,
      surveyId,
      answer,
      numberOfResponses: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
  }

  valueOf() {
    return {
      surveyDocs: this.surveyDocs,
      surveyAnswerBulk: this.surveyAnswerBulk,
    };
  }
}

// Maps keys of an object to an array
export function mapIdsToArray(insertedIds: any) {
  return Object.keys(insertedIds).reduce((a, key: any) => {
    a.push(insertedIds[key]);
    return a;
  }, []);
}
