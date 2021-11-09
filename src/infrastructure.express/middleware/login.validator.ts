import { RequestHandler } from "express";
import Joi from "joi";
import { createBadRequestError } from "./validator.utils";

const loginSchema: Joi.ObjectSchema = Joi.object({
  user: Joi.string().pattern(/^[a-zA-Z0-9]{3,24}$/),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,24}$/),
});

export const login: RequestHandler = async (req, res, next) => {
  const { error, value: sanitizedDoc } = loginSchema.validate(req.body);
  if (error) {
    return next(createBadRequestError(error));
  }
  req.body = sanitizedDoc;
  next();
};
