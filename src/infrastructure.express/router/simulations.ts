import express from "express";
import * as simulationController from "../../aplication.controllers/simulation.controller";
import { asyncCatchHandler } from "../lib/request.util";
import * as surveyValidator from "../middleware/survey.validator";
const router = express.Router({ mergeParams: true });

export default function route() {
  router
    .get(
      "/answers",
      surveyValidator.validateQuery,
      asyncCatchHandler(simulationController.generateAsnwers)
    )
    .get("/surveys", asyncCatchHandler(simulationController.generateSurveys));

  return router;
}

/**
 * @api {get} /simulations/answers?question=:question&batchId=:batchId&_limit=:_limit&_page=:_page Simulates answers to surveys.
 * @apiGroup Simulation
 * @apiDescription Generate a random number of survey answers for simulation purposes<br>
 *                 A parameters query is used to find the surveys <br>
 *
 * @apiName SimulationByQuery
 * @apiParam {String{24}} [batchId] Auto generated batch number at creation time for grouping purposes.
 * @apiParam {String{3..256}} [question]  Question of the survey.
 * @apiParam {Number{1..100}} [_limit=100] Maximum number of surveys to return
 * @apiParam {Number{0..}} [_page=0]  Number of pages to skip <br>
 *                                The number of records to skip results from the product of '_page' and '_limit'
 * @apiExample Request example
 * GET http://localhost:7777/2021-11-01/simulations/answers?batchId=61848cb9e169eceaae29cf5a
 *
 * @apiSuccessExample Sucess-Return
 * [
 *   {
 *     "surveyId": "61874e12790359129130f969",
 *     "answerId": "61874e12790359129130f971",
 *     "response": "Won",
 *     "status": "pending"
 *   },
 *   {
 *     "surveyId": "61874e12790359129130f984",
 *     "answerId": "61874e12790359129130f986",
 *     "response": "digital",
 *     "status": "pending"
 *   },
 *   {
 *     "surveyId": "61874e12790359129130f98d",
 *     "answerId": "61874e12790359129130f98f",
 *     "response": "Oklahoma",
 *     "status": "pending"
 *   },
 *   {
 *     "surveyId": "61874e12790359129130f97b",
 *     "answerId": "61874e12790359129130f981",
 *     "response": "Directives",
 *     "status": "pending"
 *   },
 *   {
 *     "surveyId": "61874e12790359129130f972",
 *     "answerId": "61874e12790359129130f977",
 *     "response": "Steel",
 *     "status": "pending"
 *   }
 * ]
 */

/**
 * @api {get} /simulations/surveys Simulates a set of surveys.
 * @apiGroup Simulation
 * @apiDescription Generate from 12 to 20  random surveys for simulation purposes<br>
 * @apiExample Request example
 * GET http://localhost:7777/2021-11-01/simulations/surveys
 *
 * @apiSuccessExample Sucess-Return
 *  [
 *   {
 *     "question": "voluptatem saepe vero",
 *     "possibleAnswers": [
 *       "online",
 *       "viral",
 *       "Account",
 *       "Mandatory",
 *       "Berkshire",
 *       "sexy",
 *       "Chicken",
 *       "even-keeled"
 *     ]
 *   },
 *   {
 *     "question": "consequuntur autem incidunt quisquam porro",
 *     "possibleAnswers": [
 *       "Security",
 *       "black",
 *       "Sleek",
 *       "Forward",
 *       "web-enabled",
 *       "sky"
 *     ]
 *   },
 *   {
 *     "question": "consequatur totam molestiae quia",
 *     "possibleAnswers": [
 *       "red",
 *       "Harbor",
 *       "Fantastic",
 *       "back-end",
 *       "architect",
 *       "Handmade"
 *     ]
 *   },
 *   {
 *     "question": "voluptas nobis dolores et",
 *     "possibleAnswers": ["Chicken", "Human", "Engineer"]
 *   },
 *   {
 *     "question": "voluptatem dignissimos impedit ut",
 *     "possibleAnswers": ["Fish", "Visionary", "intangible"]
 *   },
 *   {
 *     "question": "laboriosam laboriosam error sit",
 *     "possibleAnswers": ["approach", "Global", "Avon", "circuit", "utilize"]
 *   },
 *   {
 *     "question": "molestias et quibusdam dolores",
 *     "possibleAnswers": [
 *       "teal",
 *       "gold",
 *       "Personal",
 *       "e-commerce",
 *       "Intranet",
 *       "JBOD"
 *     ]
 *   },
 *   {
 *     "question": "non cum et",
 *     "possibleAnswers": ["maximize", "Brook", "Fish", "cross-platform"]
 *   },
 *   {
 *     "question": "assumenda ut repellat rerum",
 *     "possibleAnswers": ["Incredible", "Grocery", "1080p"]
 *   },
 *   {
 *     "question": "nam perspiciatis nemo",
 *     "possibleAnswers": ["Kids", "lavender"]
 *   },
 *   {
 *     "question": "delectus culpa aut",
 *     "possibleAnswers": [
 *       "Automotive",
 *       "deposit",
 *       "Iraq",
 *       "National",
 *       "architecture",
 *       "composite"
 *     ]
 *   },
 *   {
 *     "question": "non omnis non ut minima",
 *     "possibleAnswers": ["Unbranded", "1080p"]
 *   },
 *   {
 *     "question": "totam quia est ullam perferendis",
 *     "possibleAnswers": [
 *       "Hawaii",
 *       "Account",
 *       "Incredible",
 *       "Chicken",
 *       "Focused",
 *       "Gorgeous",
 *       "non-volatile"
 *     ]
 *   }
 * ]
 */
