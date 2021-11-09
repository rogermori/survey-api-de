import Joi from "joi";
import config from "../../config/configuration";
import {
  ResponseInfo,
  ResponseInfoInput,
} from "../../infrastructure.mongodb/types";
import { isJoiValidMongoId } from "../../infrastructure.mongodb/utils";

const {
  defaults: {
    query,
    survey: { question, possibleAnswers, response },
  },
} = config;

export const validateResponseInfo = (doc: ResponseInfoInput[]) =>
  responseListSchema.validate(doc);

export const responseSchema: Joi.ObjectSchema<ResponseInfo> = Joi.object({
  surveyId: Joi.string().required().custom(isJoiValidMongoId),
  answerId: Joi.string().required().custom(isJoiValidMongoId),
  response: Joi.string()
    .required()
    .trim()
    .min(possibleAnswers.answer.min)
    .max(possibleAnswers.answer.max),
  status: Joi.string().valid("pending", "completed").required(),
});

export const responseListSchema: Joi.ArraySchema = Joi.array()
  .items(responseSchema)
  .min(1)
  .max(response.limit)
  .unique("surveyId")
  .prefs({ errors: { label: "key" }, abortEarly: false });

export const querySchema = Joi.object({
  responseBatchId: Joi.string().custom(isJoiValidMongoId),
  contextId: Joi.string().custom(isJoiValidMongoId),
  surveyBatchId: Joi.string().custom(isJoiValidMongoId),
  _limit: Joi.number().default(query._limit).max(query._limit),
  _page: Joi.number().default(query._page).min(query._page),
}).prefs({ errors: { label: "key" }, abortEarly: false });
