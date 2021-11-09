import { expectCt } from "helmet";
import httpStatus from "http-status";
import request from "supertest";
import app from "../../src/infrastructure.express/index";
import { encodeToken } from "../../src/infrastructure.express/middleware/jwt.authenticator";
import { mongoClient, mongoDB } from "../../src/infrastructure.mongodb/connect";
import { createAListOfSurveys } from "../../src/lib/survey.util";
describe("Survey Endpoints", () => {
  let listOfSurveys: any;
  let accessToken: string;
  beforeAll(async () => {
    await mongoClient.connect();
    accessToken = encodeToken({ userId: "tester" });
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  beforeEach(() => {
    listOfSurveys = createAListOfSurveys();
  });

  describe("create", () => {
    it("should return CREATED with a valid payload", async () => {
      const surveyInfoList = createAListOfSurveys(5, 4, 8);
      const response = await request(app)
        .post(`/2021-11-01/surveys`)
        .set("Access-Token", accessToken)
        .send(surveyInfoList);
      expect(response.statusCode).toEqual(httpStatus.CREATED);
      expect(response.header).toHaveProperty("location");
      expect(response.body.location).toBeTruthy();
      expect(response.body.createdSurveys.length).toBeGreaterThan(0);
    });
  });

  describe(`find survey by id`, () => {
    it("GET /2021-11-01/surveys/surveyId should find a survey with a valid id", async () => {
      const response = await request(app)
        .post(`/2021-11-01/surveys`)
        .set("Access-Token", accessToken)
        .send(createAListOfSurveys(1));
      const surveyId = response.body.createdSurveys[0].surveyId;
      const survey = await request(app)
        .get(`/2021-11-01/surveys/${surveyId}`)
        .send();
      expect(survey.body).toHaveProperty("surveyId");
      expect(survey.body).toHaveProperty("possibleAnswers");
      expect(surveyId).toBe(`${survey.body.surveyId}`);
    });
  });

  describe("find surveys by query", () => {
    it("GET /2021-11-01/surveys?query should return surveys by a valid query", async () => {
      const survey = await request(app)
        .get("/2021-11-01/surveys?_sort[question]=DESC&_limit=50&_page=0")
        .send();
      expect(survey.body).toBeInstanceOf(Array);
      expect(survey.body.length).toBeGreaterThan(0);
    });
  });
});
