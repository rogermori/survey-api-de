import Joi from "joi";
import httpStatus from "http-status";
import { AppError } from "../lib/error.handler";

export const createBadRequestError = (error: Joi.ValidationError) =>
  new AppError(
    error.details.map((detail) => detail.message).join(";"),
    httpStatus.BAD_REQUEST
  );

// helper function
// return an array of object with a single key
export const generateListWithKey = (instanceList: any, key: string) =>
  instanceList.map((instance: any) => instance[key]);
