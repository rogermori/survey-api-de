import { RequestHandler } from "express";
import httpStatus from "http-status";
import * as Service from "../domain.services/response.service";
import * as Utils from "./response.controller.utils";

const { CREATED, OK } = httpStatus;

export const createResponses: RequestHandler = async (req, res, next) => {
  const responseBatchId = await Service.addReponses(
    req.params.contextId,
    req.body
  );
  res.header("location", Utils.createLocationHeader(responseBatchId));
  res.status(CREATED).json(Utils.createResponse(responseBatchId));
};

export const findResponsesByQuery: RequestHandler = async (req, res, next) => {
  const surveys = await Service.searchResponses(req.query);
  return res.status(OK).json(surveys);
};
