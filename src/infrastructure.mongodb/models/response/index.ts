import { ObjectId, OrderedBulkOperation } from "mongodb";
import { mongoClient, mongoDB } from "../../connect";
import { ResponseInfo } from "../../types";
import { ResponseOperationFactory } from "./response.utils";

export const SurveyResponse = () => mongoDB().collection("surveyresponses");

export const createContextResponses = async (
  responseInfoList: ResponseInfo[]
) => {
  const session = mongoClient.startSession();
  const responseBatchId = new ObjectId().toString();

  try {
    session.startTransaction();
    const bulkOperationList: OrderedBulkOperation[] =
      new ResponseOperationFactory(responseInfoList, responseBatchId).valueOf();

    for (const bulk of bulkOperationList) {
      await bulk.execute(); // await Promise.all not suported by the driver
    }

    await session.commitTransaction();
    return responseBatchId;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    session.endSession();
  }
};
