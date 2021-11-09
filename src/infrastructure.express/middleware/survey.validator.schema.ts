import Joi from "joi";
import config from "../../config/configuration";
import { SurveyInfoInput } from "../../infrastructure.mongodb/types";
import { isJoiValidMongoId } from "../../infrastructure.mongodb/utils";

const {
  defaults: {
    query,
    survey: { question, possibleAnswers },
  },
} = config;

export const surveySchema: Joi.ObjectSchema<SurveyInfoInput> = Joi.object({
  question: Joi.string().required().trim().min(question.min).max(question.max),
  possibleAnswers: Joi.array()
    .min(possibleAnswers.min)
    .max(possibleAnswers.max)
    .items(
      Joi.string()
        .required()
        .trim()
        .min(possibleAnswers.answer.min)
        .max(possibleAnswers.answer.max)
    )
    .unique(),
}).prefs({ errors: { label: "key" }, abortEarly: false });

export const surveyListSchema: Joi.ArraySchema = Joi.array()
  .items(surveySchema)
  .min(1)
  .max(question.limit)
  .unique("question")
  .prefs({ errors: { label: "key" }, abortEarly: false });

export const querySchema = Joi.object({
  question: Joi.string().min(question.min).max(question.max),
  batchId: Joi.string().custom(isJoiValidMongoId),
  _limit: Joi.number().default(query._limit).max(query._limit),
  _page: Joi.number().default(query._page).min(query._page),
  _sort: Joi.object({
    question: Joi.string().valid("ASC", "DESC").required(),
  }).default({ question: "ASC" }),
}).prefs({ errors: { label: "key" }, abortEarly: false });

export const validateSurveyInfo = (doc: SurveyInfoInput[]) =>
  surveyListSchema.validate(doc);
