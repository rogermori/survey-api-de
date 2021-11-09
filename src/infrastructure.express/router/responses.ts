import express from "express";
import * as controller from "../../aplication.controllers/response.controller";
import { asyncCatchHandler } from "../lib/request.util";
import { validDocumentId } from "../middleware/id.validator";
import * as responseValidator from "../middleware/response.validator";

const router = express.Router({ mergeParams: true });

export default function route() {
  router
    .get(
      "/",
      responseValidator.validateQuery,
      asyncCatchHandler(controller.findResponsesByQuery)
    )
    .post(
      "/contexts/:contextId",
      validDocumentId("contextId"),
      responseValidator.create,
      asyncCatchHandler(controller.createResponses)
    );

  return router;
}

/**
 * @api {post} /responses/:contextId Create responses to surveys.
 * @apiName CreateAnswers
 * @apiDescription Surveys are answered in a single context.<br>
 *                 An Answer Survey System can respond from 1 up to 100 surveys.<br>
 *                 Every survey in the request must be unique<br>
 *                 Evey survey must exist and be open.<br>
 *                 Every answer must exist.<br>
 *                 The system auto generates a responseBatchId identificador for grouping purposes.
 * @apiGroup SurveyAnswers
 * @apiParam {String{24}} contextId Context unique identifier <br>
 *                                  Any random 24 characters string will work.
 * @apiBody {Responses[]} body  Body request.<br>
 *                           Contains an array from 1 up to 100 Response objects.
 * @apiBody  {Object}   body.Response Every Response object included in the array.
 * @apiBody  {String}   body.Response.surveyId Survey unique identifier.
 * @apiBody  {String}   body.Response.answerId Answer unique identifier.
 * @apiBody  {String}   body.Response.response Answer's value.
 * @apiBody  {String="pending","completed"}   body.Response.status Status of the response
 * @apiExample  Request example:
 * POST http://localhost:7777/2021-11-01/responses/123456789012345678901237
 *
 * @apiSuccess {Object} body Object containing the url locations of the created/updated responses.
 * @apiSuccess {String} body.location Url pointing to all created or updated responses.
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *   "location": "//2021-11-01/responses?responseBatchId=61889cb129e43b0eb3d6d595"
 * }
 *
 * @apiError BadRequest Invalid Surveys
 * @apiErrorExample BadRequest
 * {
 *  "status": "fail",
 *  "error": {
 *    "statusCode": 400,
 *    "status": "fail",
 *    "isOperational": true,
 *  },
 *  "message": "Error: survey(s) not found or closed",
 *}
 */

/**
 * @api {get} /responses?contextId=:contextI&dresponseBatchId=:responseBatchId&surveyBatchId=:surveyBatchId&_limit=:_limit&_page=:_page Fetch a set of responses.
 * @apiDescription Search a set of responses via query parameters.<br>
 *                 The maximum limit of responses is 100.
 *
 * @apiName SearchAnswerByQuery
 * @apiGroup SurveyAnswers
 * @apiParam {String} [contextId] Context identifier used to create the answers.
 * @apiParam {String} [surveyBatchId] Survey batch number.
 * @apiParam {String} [responseBatchId] Auto generated batch number for grouping purposes.
 * @apiParam {Number{1..100}} [_limit=100]  Maximum number of surveys to return
 * @apiParam {Number} [_page=0] Number of pages to skip <br>
 *                              The number of records to skip results from the product of '_page' and '_limit'
 *
 * @apiExample by responseBatchId
 * GET http://localhost:7777/2021-11-01/responses?responseBatchId=61848cb9e169eceaae29cf5a
 *
 * @apiExample by surveyBatchId
 * GET http://localhost:7777/2021-11-01/responses?surveyBatchId=61874e12790359129130f97
 *
 * @apiExample by ContextId
 * GET http://localhost:7777/2021-11-01/responses?contextId=123456789012345678901237
 *
 * @apiSuccess {Survey[]} body Array of responses
 * @apiSuccessExample Success-Response:
 *  [
 *   {
 *     "answerId": "61874e12790359129130f96d",
 *     "contextId": "123456789012345678901237",
 *     "surveyId": "61874e12790359129130f969",
 *     "createdAt": "2021-11-08T03:42:41.776Z",
 *     "response": "Human",
 *     "status": "pending",
 *     "updatedAt": "2021-11-08T03:42:41.776Z",
 *     "responseId": "61889cb2e1cdb0cd1ca5c51a",
 *     "question": "assumenda necessitatibus quos voluptatum",
 *     "surveyBatchId": "61874e12790359129130f968"
 *   },
 *   {
 *     "answerId": "61874e12790359129130f986",
 *     "contextId": "123456789012345678901237",
 *     "surveyId": "61874e12790359129130f984",
 *     "createdAt": "2021-11-08T03:42:41.777Z",
 *     "response": "digital",
 *     "status": "completed",
 *     "updatedAt": "2021-11-08T03:42:41.777Z",
 *     "responseId": "61889cb2e1cdb0cd1ca5c51b",
 *     "question": "atque harum esse non",
 *     "surveyBatchId": "61874e12790359129130f968"
 *   },
 *   {
 *     "answerId": "61874e12790359129130f990",
 *     "contextId": "123456789012345678901237",
 *     "surveyId": "61874e12790359129130f98d",
 *     "createdAt": "2021-11-08T03:42:41.777Z",
 *     "response": "Handcrafted",
 *     "status": "pending",
 *     "updatedAt": "2021-11-08T03:42:41.777Z",
 *     "responseId": "61889cb2e1cdb0cd1ca5c51c",
 *     "question": "consectetur architecto asperiores rem",
 *     "surveyBatchId": "61874e12790359129130f968"
 *   },
 *   {
 *     "answerId": "61874e12790359129130f980",
 *     "contextId": "123456789012345678901237",
 *     "surveyId": "61874e12790359129130f97b",
 *     "createdAt": "2021-11-08T03:42:41.777Z",
 *     "response": "Assurance",
 *     "status": "pending",
 *     "updatedAt": "2021-11-08T03:42:41.777Z",
 *     "responseId": "61889cb2e1cdb0cd1ca5c51d",
 *     "question": "consequuntur amet accusantium tempora",
 *     "surveyBatchId": "61874e12790359129130f968"
 *   },
 *   {
 *     "answerId": "61874e12790359129130f977",
 *     "contextId": "123456789012345678901237",
 *     "surveyId": "61874e12790359129130f972",
 *     "createdAt": "2021-11-08T03:42:41.777Z",
 *     "response": "Steel",
 *     "status": "completed",
 *     "updatedAt": "2021-11-08T03:42:41.777Z",
 *     "responseId": "61889cb2e1cdb0cd1ca5c51e",
 *     "question": "laborum quas temporibus est",
 *     "surveyBatchId": "61874e12790359129130f968"
 *   }
 * ]
 * @apiUse badrequest
 * @apiUse invalidId
 */
