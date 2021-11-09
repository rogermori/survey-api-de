import { ObjectId } from "mongodb";
import { mongoClient, mongoDB } from "../../connect";
import { CreatedSurveyResponse, SurveyInfoInput } from "../../types";
import * as Utils from "./survey.utils";

export const Survey = () => mongoDB().collection("surveys");

export const SurveyAnswer = () => mongoDB().collection("surveyanswers");

export const createSurveys = async (
  surveys: SurveyInfoInput[],
  userId: string
): Promise<CreatedSurveyResponse> => {
  const session = mongoClient.startSession();
  const batchId = new ObjectId().toString();
  try {
    session.startTransaction();
    const { surveyDocs, surveyAnswerBulk } = new Utils.SurveyParametersFactory(
      surveys,
      batchId,
      userId
    ).valueOf();
    const { insertedIds } = await Survey().insertMany(surveyDocs, { session });
    await surveyAnswerBulk.execute({ session });
    await session.commitTransaction();
    return { batchId, createdIds: Utils.mapIdsToArray(insertedIds) };
  } catch (error) {
    return Promise.reject(error);
  } finally {
    session.endSession();
  }
};

export const updateStatus = async (batchId: string, close: boolean) => {
  const session = mongoClient.startSession();
  try {
    session.startTransaction();
    await Survey().updateMany(
      { batchId, status: close ? "open" : "closed" },
      { $set: { status: close ? "closed" : "open", updatedAt: new Date() } },
      { session }
    );
    await session.commitTransaction();
    return batchId;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    session.endSession();
  }
};
