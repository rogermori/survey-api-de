import express from "express";
import { jwtLogin } from "../../aplication.controllers/login.controller";
import * as validator from "../middleware/login.validator";
const router = express.Router({ mergeParams: true });

export default function route() {
  router.post("/", validator.login, jwtLogin);
  return router;
}

/**
 * @api {post} /login Authenticates admin users
 * @apiName Authentication
 * @apiGroup UserAdmin
 *
 * @apiBody {String{3..24}} user User's name.<br>
 *                               Only alphanumeric characters are allowed.<br>
 *                               Enter any random user name.
 *
 * @apiBody {String{3..24}} password User's password.<br>
 *                                   Only alphanumeric characters are allowed.<br>
 *                                   Enter any random password.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *         "accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJyb2dlciIsImp0aSI6ImFlNTBjN2QxLWQwMTItNGFhOC05NTM4LWI3NGQzNDJmMTZhOCIsImlhdCI6MTYzNjI1NDM1OCwiZXhwIjoxNjM2MjU3OTU4fQ.eSXiho0t8mdJrdgr_s013zu1ktELuduxmzl5LwNpW6M"
 *       }
 *
 * @apiError Bad-Request Invalid user or password
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *      {
 *        "status": "fail",
 *        "error": {
 *          "statusCode": 400,
 *          "status": "fail",
 *          "isOperational": true,
 *          "level": "\u001b[31merror\u001b[39m"
 *        },
 *        "message": "Error: \"user\" with value \"ro-\" fails to match the required pattern: /^[a-zA-Z0-9]{3,24}$/"
 *      }
 */
