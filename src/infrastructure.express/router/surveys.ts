import express from "express";
import * as surveyController from "../../aplication.controllers/survey.controller";
import { asyncCatchHandler } from "../lib/request.util";
import { validDocumentId } from "../middleware/id.validator";
import { isAuthenticated } from "../middleware/jwt.authenticator";
import * as surveyValidator from "../middleware/survey.validator";

const router = express.Router({ mergeParams: true });

export default function route() {
  router
    .post(
      "/",
      isAuthenticated,
      surveyValidator.create,
      asyncCatchHandler(surveyController.create)
    )
    .get(
      "/",
      surveyValidator.validateQuery,
      asyncCatchHandler(surveyController.findByQuery)
    )
    .get(
      "/:surveyId",
      validDocumentId("surveyId"),
      asyncCatchHandler(surveyController.findById)
    )
    .put(
      "/:batchId/open",
      isAuthenticated,
      validDocumentId("batchId"),
      asyncCatchHandler(surveyController.updateStatus(true))
    )
    .put(
      "/:batchId/closed",
      isAuthenticated,
      validDocumentId("batchId"),
      asyncCatchHandler(surveyController.updateStatus(false))
    );

  return router;
}

/**
 *
 * @apiDefine Unauthorized
 * @apiError Unauthorized User not authenticated.
 */

/**
 * @apiDefine error401
 * @apiErrorExample UnauthorizedError
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "status": 401,
          "error": {
          "message": "UnauthorizedError: user not authenticated"
          }
 *     }
 */

/**
 * @apiDefine badrequest
 * @apiError BadRequest Invalid request
 */

/**
 * @apiDefine invalidId
 * @apiErrorExample BadRequest
 * HTTP/1.1 400 Bad Request
 *
 * {
 *  "status": 400,
 *  "error": {
 *    "message": "BadRequestError: Invalid document Id",
 *    "isOperational" : "true"
 *    "statusCode": 400
 *  },
 *  "message": "BadRequestError: Invalid document Id"
 * }
 */

/**
 * @apiDefine accesstoken
 * @apiHeader {String} Access-Token Access token
 */

/**
 * @api {post} /surveys Creates a set of surveys
 * @apiName CreateSurveys
 * @apiDescription Users can create from to 1 up to 100 surveys.<br>
 *                 Every question's survey must be unique. <br>
 *                 The system auto generates a batchId identificador for grouping purposes.
 * @apiGroup Survey
 * @apiUse accesstoken
 * @apiBody {Answer[]} body  Body request.<br>
 *                           Contains an array from 2 up to 100 Answer objects.
 * @apiBody  {Object}   body.Answer Every Answer object included in the array.
 * @apiBody {String{3..256}}  body.Answer.question  Question of the survey.
 * @apiBody {String[]{2..100}} body.Answer.possibleAnswers List of unique possible answers.<br>
 *                                                    Every answers is a String from 1 up to 64 characters.
 * @apiExample  Request example:
 * POST http://localhost:7777/2021-11-01/surveys
 * Access-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJyb2dlciIsImp0aSI6ImQzNGNkMWU1LWM2YmUtNGMyMy05NzE1LTg0YjZlMWM4ODVjMiIsImlhdCI6MTYzNjI1NzE4MSwiZXhwIjoxNjM2MjYwNzgxfQ.wZ0IsaJ_FPD4FdFJkswg8ueVDHsuhJPl4-FZktTRXxQ
 *
 * [
 *   {
 *     "question": "assumenda necessitatibus quos voluptatum",
 *     "possibleAnswers": [
 *       "Tools",
 *       "generating",
 *       "Account",
 *       "Human",
 *       "Accountability",
 *       "Won"
 *     ]
 *   },
 *   {
 *     "question": "laborum quas temporibus est",
 *     "possibleAnswers": [
 *       "Checking",
 *       "Home",
 *       "robust",
 *       "orange",
 *       "Lead"
 *     ]
 *   },
 *   {
 *     "question": "consequuntur amet accusantium tempora",
 *     "possibleAnswers": [
 *       "cutting-edge",
 *       "Fantastic",
 *       "Assurance",
 *       "Directives",
 *       "circuit",
 *       "leverage"
 *     ]
 *   },
 *   {
 *     "question": "atque harum esse non",
 *     "possibleAnswers": [
 *       "Factors",
 *       "Ferry"
 *     ]
 *   },
 *   {
 *     "question": "consectetur architecto asperiores rem",
 *     "possibleAnswers": [
 *       "Chips",
 *       "Oklahoma",
 *       "Shoes",
 *       "seamless"
 *     ]
 *   }
 * ]
 * @apiSuccess {Object} body Object containing url locations of the created surveys.
 * @apiSuccess {String} body.location Url pointing to all created surveys.
 * @apiSuccess {Object[]} body.createdSurveys Array of Survey records.
 * @apiSuccess {String} body.createdSurveys.surveyId Survey unique identifier.
 * @apiSuccess {String} body.createdSurveys.location URL pointing to the created Survey.
 *
 * @apiSuccessExample {json} Success-Response
 *  {
 *    "location": "//2021-11-01/surveys?batchId=61876c506a211487112972ba",
 *    "createdSurveys": [
 *      {
 *        "surveyId": "61876c506a211487112972bb",
 *        "location": "//2021-11-01/survey/61876c506a211487112972bb"
 *      },
 *      {
 *        "surveyId": "61876c506a211487112972c4",
 *        "location": "//2021-11-01/survey/61876c506a211487112972c4"
 *      },
 *      {
 *        "surveyId": "61876c506a211487112972cd",
 *        "location": "//2021-11-01/survey/61876c506a211487112972cd"
 *      },
 *      {
 *        "surveyId": "61876c506a211487112972d6",
 *        "location": "//2021-11-01/survey/61876c506a211487112972d6"
 *      },
 *      {
 *        "surveyId": "61876c506a211487112972df",
 *        "location": "//2021-11-01/survey/61876c506a211487112972df"
 *      }
 *    ]
 *  }
 *
 * @apiUse Unauthorized
 * @apiUse error401
 *
 * @apiError BadRequest-Duplicated Duplicated value.
 * @apiErrorExample BadRequest-Duplicated
 * HTTP/1.1 400 Bad Request
 *
 * {
 *  "status": "fail",
 *  "error": {
 *    "statusCode": 400,
 *    "status": "fail",
 *    "isOperational": true,
 *  },
 *  "message": "Error: \"[2]\" contains a duplicate value",
 *}
 */

/**
 * @api {get} /surveys/:surveyId Fetch a single Survey
 * @apiName FindById
 * @apiGroup Survey
 * @apiParam {String{24}} surveyId Survey unique identifier.<br>
 *                             A string representing a MongoDB's ObjectId
 *
 * @apiSuccess {String{24}} surveyId Survey identifier.
 * @apiSuccess  {String{24}} batchId Batch number for grouping purposes.
 * @apiSuccess {String{3..256}} question  Question of the survey.
 * @apiSuccess {Number} numberOfResponses Counts the number of submitted responses with "completed" status.
 * @apiSuccess {Number{2..100}} numberOfAnswers Number of possible answers.
 * @apiSuccess {String="open","closed"} status Survey status <br>
 *                                             Closed surveys cannot be answered.
 * @apiSuccess {Object[]} possibleAnwers List of possible answers.
 * @apiSuccess {Object[]} responses List of responses.
 * @apiSuccess {Date} createdAt Creation date.
 * @apiSuccess {Date} updatedAt Newest update date.
 * @apiSuccess {String} createdBy Admin user who created the survey.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "surveyId": "6184889c8a9485f8e2ff1bcc"
 *      "question": "consectetur architecto asperiores rem",
 *      "numberOfAnswers": 8,
 *      "numberOfResponses": 0,
 *      "status": "open",
 *      "createdAt": "2021-11-05T01:27:56.978Z",
 *      "updatedAt": "2021-11-06T01:40:34.512Z",
 *      "createdBy": "roger",
 *      "possibleAnswers": [
 *        {
 *          "answer": "up",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bd1"
 *        },
 *        {
 *          "answer": "invoice",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bd2"
 *        },
 *        {
 *          "answer": "Configuration",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bd0"
 *        },
 *        {
 *          "answer": "Shoes",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bd3"
 *        },
 *        {
 *          "answer": "seamless",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bd4"
 *        },
 *        {
 *          "answer": "Oklahoma",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bce"
 *        },
 *        {
 *          "answer": "Handcrafted",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bcf"
 *        },
 *        {
 *          "answer": "Chips",
 *          "numberOfResponses": 0,
 *          "updatedAt": "2021-11-05T01:27:56.978Z",
 *          "answerId": "6184889c8a9485f8e2ff1bcd"
 *        }
 *      ],
 *      "responses": [
 *        {
 *          "answerId": "6184889c8a9485f8e2ff1bcf",
 *          "contextId": "123456789012345678901236",
 *          "createdAt": "2021-11-05T01:45:29.301Z",
 *          "response": "Handcrafted",
 *          "status": "pending",
 *          "updatedAt": "2021-11-05T01:45:29.301Z",
 *          "responseId": "61848cbdf6a7d0c0d6605e64"
 *        },
 *        {
 *          "answerId": "6184889c8a9485f8e2ff1bcf",
 *          "contextId": "123456789012345678901237",
 *          "createdAt": "2021-11-06T01:40:40.599Z",
 *          "response": "Handcrafted",
 *          "status": "pending",
 *          "updatedAt": "2021-11-06T01:40:40.599Z",
 *          "responseId": "6185dc9ce1cdb0cd1c2f8e66"
 *        }
 *      ]
 *    }
 * @apiUse badrequest
 * @apiUse invalidId
 *
 */

/**
 * @api {get} /surveys?question=:question&batchId=:batchId&_limit=:_limit&_page=:_page&_sort[question]=:ASC_DESC Fetch a set of surveys.
 * @apiDescription Search a set of surveys via query parameters.<br>
 *                 The maximum limit of surveys is 100.<br>
 *                 The result set can be ordered by 'question' in order ascending or descending.
 * @apiName SearchByQuery
 * @apiGroup Survey
 * @apiParam {String{24}} [batchId] Auto generated batch number at creation time for grouping purposes.
 * @apiParam {String{3..256}} [question]  Question of the survey.
 * @apiParam {Number{1..100}} [_limit=100] Maximum number of surveys to return
 * @apiParam {Number{0..}} [_page=0]  Number of pages to skip <br>
 *                                The number of records to skip results from the product of '_page' and '_limit'
 * @apiParam {Object} [_sort=_sort]  Sort options
 * @apiParam {String="ASC","DESC"} [_sort.question='ASC']  Ascending or Descending
 *
 * @apiExample Request example
 * GET http://localhost:7777/2021-11-01/surveys?batchId={{batchId}}&_limit=2&_page=0&&_sort[question]=DESC
 *
 * @apiSuccess {Survey[]} body Array of Surveys
 * @apiSuccessExample Success-Response:
 * [
 *   {
 *     "batchId": "61874e12790359129130f968",
 *     "question": "laborum quas temporibus est",
 *     "numberOfResponses": 0,
 *     "createdAt": "2021-11-07T03:54:58.461Z",
 *     "updatedAt": "2021-11-07T03:54:58.461Z",
 *     "numberOfAnswers": 8,
 *     "status": "open",
 *     "createdBy": "roger",
 *     "possibleAnswers": [
 *       {
 *         "answer": "Checking",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f973"
 *       },
 *       {
 *         "answer": "matrix",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f976"
 *       },
 *       {
 *         "answer": "Steel",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f977"
 *       },
 *       {
 *         "answer": "Lead",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f97a"
 *       }
 *     ],
 *     "responses": [],
 *     "surveyId": "61874e12790359129130f972"
 *   },
 *   {
 *     "batchId": "61874e12790359129130f968",
 *     "question": "assumenda necessitatibus quos voluptatum",
 *     "numberOfResponses": 0,
 *     "createdAt": "2021-11-07T03:54:58.460Z",
 *     "updatedAt": "2021-11-07T03:54:58.460Z",
 *     "numberOfAnswers": 8,
 *     "status": "open",
 *     "createdBy": "roger",
 *     "possibleAnswers": [
 *       {
 *         "answer": "Account",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f96c"
 *       },
 *       {
 *         "answer": "Human",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f96d"
 *       },
 *       {
 *         "answer": "Dollar",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f970"
 *       },
 *       {
 *         "answer": "Won",
 *         "numberOfResponses": 0,
 *         "updatedAt": "2021-11-07T03:54:58.461Z",
 *         "answerId": "61874e12790359129130f971"
 *       }
 *     ],
 *     "responses": [],
 *     "surveyId": "61874e12790359129130f969"
 *   }
 * ]
 * @apiError BadRequest  Invalid query
 * @apiErrorExample BadRequest
 * HTTP/1.1 400 Bad Request
 *
 * {
 *  "status": "fail",
 *  "error": {
 *    "statusCode": 400,
 *    "status": "fail",
 *    "isOperational": true,
 *  },
 *  "message": "Error details in the query parameters",
 * }
 */

/**
 * @api {put} /surveys/:batchId/open Closes a set of open surveys.
 * @apiName CloseSurveys
 * @apiGroup Survey
 * @apiExample  Request example:
 * PUT http://localhost:7777/2021-11-01/61874e12790359129130f968/open
 * Access-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJyb2dlciIsImp0aSI6ImQzNGNkMWU1LWM2YmUtNGMyMy05NzE1LTg0YjZlMWM4ODVjMiIsImlhdCI6MTYzNjI1NzE4MSwiZXhwIjoxNjM2MjYwNzgxfQ.wZ0IsaJ_FPD4FdFJkswg8ueVDHsuhJPl4-FZktTRXxQ
 * @apiParam {String{24}} batchId Auto generated batch number at creation time.
 * @apiSuccess {String} location URL pointing to the updated surveys
 * @apiSuccessExample Success-Response
 *  { "location": "//2021-11-01/surveys?batchId=61874e12790359129130f968" }
 * @apiHeader {String} Access-Token Access token
 * @apiUse badrequest
 * @apiUse invalidId
 */

/**
 * @api {put} /surveys/:batchId/closed Open a set of closed surveys.
 * @apiName OpenSurveys
 * @apiGroup Survey
 * @apiExample  Request example:
 * PUT http://localhost:7777/2021-11-01/61874e12790359129130f968/closed
 * Access-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJyb2dlciIsImp0aSI6ImQzNGNkMWU1LWM2YmUtNGMyMy05NzE1LTg0YjZlMWM4ODVjMiIsImlhdCI6MTYzNjI1NzE4MSwiZXhwIjoxNjM2MjYwNzgxfQ.wZ0IsaJ_FPD4FdFJkswg8ueVDHsuhJPl4-FZktTRXxQ
 * @apiParam {String{24}} batchId Auto generated batch number at creation time.
 * @apiSuccess {String} location URL pointing to the updated surveys
 * @apiSuccessExample Success-Response
 *  { "location": "//2021-11-01/surveys?batchId=61874e12790359129130f968" }
 * @apiHeader {String} Access-Token Access token
 * @apiUse badrequest
 * @apiUse invalidId
 */
