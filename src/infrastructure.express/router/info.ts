import express from "express";
import config from "../../config/configuration";
import listEndPoints from "express-list-endpoints";
const router = express.Router({ mergeParams: true });

export default function route(app: express.Express) {
  router.get("/", apiInfo(app));

  return router;
}

const apiInfo =
  (app: express.Express): express.RequestHandler =>
  (req, res, next) => {
    res.json({
      version: Object.keys(config.api.version).join(),
      server: {
        url: config.hostname,
      },
      resources: listEndPoints(app)
        .filter((endpoint) => endpoint.path[0] === "/")
        .map(({ path }) => path)
        .sort(),
    });
  };

//const formatEndpoints = (app) => listEndPoints(app).
/*
{
  "version": "2021-11-01",
  "server": { "url": "http://localhost:7777" },
  "resources": [
    "/2021-11-01/info",
    "/2021-11-01/login",
    "/2021-11-01/responses",
    "/2021-11-01/responses/contexts/:contextId",
    "/2021-11-01/simulations/answers",
    "/2021-11-01/simulations/surveys",
    "/2021-11-01/surveys",
    "/2021-11-01/surveys/:batchId/closed",
    "/2021-11-01/surveys/:batchId/open",
    "/2021-11-01/surveys/:surveyId"
  ]
}
*/
/**
 * @api {get} /info Survey Api Info
 * @apiGroup ApiInfo
 * @apiDescription Show the API version, Server info and the list of available resources.
 * @apiExample Success-Response
 *
 * {
 *   "version": "2021-11-01",
 *   "server": { "url": "http://localhost:7777" },
 *   "resources": [
 *     "/2021-11-01/info",
 *     "/2021-11-01/login",
 *     "/2021-11-01/responses",
 *     "/2021-11-01/responses/contexts/:contextId",
 *     "/2021-11-01/simulations/answers",
 *     "/2021-11-01/simulations/surveys",
 *     "/2021-11-01/surveys",
 *     "/2021-11-01/surveys/:batchId/closed",
 *     "/2021-11-01/surveys/:batchId/open",
 *     "/2021-11-01/surveys/:surveyId"
 *   ]
 * }
 */
