import { ObjectId, OrderedBulkOperation } from "mongodb";
import { SurveyResponse } from ".";
import { ResponseInfo } from "../../types";
import { SurveyAnswer, Survey } from "../survey";

// Creates an array of bulk operations used to upsert responses and
// update stats in surveys and answers
export class ResponseOperationFactory {
  responseInfoList: ResponseInfo[];
  responseBatchId: string;

  // helper attributes
  completedAnswers: number = 0;
  responseBulk = SurveyResponse().initializeOrderedBulkOp();
  surveyAnswerBulk = SurveyAnswer().initializeOrderedBulkOp();
  surveyBulk = Survey().initializeOrderedBulkOp();

  // output attributes
  bulkOperations: OrderedBulkOperation[] = [];

  constructor(responseInfoList: ResponseInfo[], responseBatchId: string) {
    this.responseInfoList = responseInfoList;
    this.responseBatchId = responseBatchId;
    this.build();
  }

  valueOf = () => this.bulkOperations;
  build() {
    for (const responseInfo of this.responseInfoList) {
      this.responseBulk
        .find(this.findResponse(responseInfo))
        .upsert()
        .updateOne({
          $set: this.mapToResponse(responseInfo),
        });
      if (responseInfo.status === "pending") continue;
      this.completedAnswers++;
      this.surveyAnswerBulk
        .find({ _id: new ObjectId(responseInfo.answerId) })
        .updateOne(this.updateStats());
      this.surveyBulk
        .find({ _id: new ObjectId(responseInfo.surveyId) })
        .updateOne(this.updateStats());
    }
    this.completedAnswers &&
      this.bulkOperations.push(this.surveyAnswerBulk, this.surveyBulk);
    this.bulkOperations.unshift(this.responseBulk);
  }
  mapToResponse({
    answerId,
    surveyId,
    contextId,
    response,
    status,
  }: ResponseInfo) {
    return {
      responseBatchId: this.responseBatchId,
      surveyId: new ObjectId(surveyId),
      answerId: new ObjectId(answerId),
      response,
      contextId,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  findResponse({ answerId, surveyId, contextId }: ResponseInfo) {
    return {
      surveyId: new ObjectId(surveyId),
      answerId: new ObjectId(answerId),
      contextId,
    };
  }

  updateStats = () => ({
    $set: { updatedAt: new Date() },
    $inc: { numberOfResponses: 1 },
  });
}
