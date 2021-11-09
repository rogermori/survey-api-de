import faker from "faker";
import Joi from "joi";
import { validateSurveyInfo } from "../../src/infrastructure.express/middleware/survey.validator.schema";
import { SurveyInfoInput } from "../../src/infrastructure.mongodb/types";
import { createRandomSurvey } from "../../src/lib/survey.util";
describe("Survey Validation", () => {
  describe(`Validations`, () => {
    let surveyInfo: SurveyInfoInput[];

    beforeEach(() => {
      surveyInfo = [createRandomSurvey()];
    });

    it("should fail on null", () => {
      const { error } = validateSurveyInfo(null);
      expect(error).toBeInstanceOf(Joi.ValidationError);
    });

    it("should fail on undefined", () => {
      const { error, value } = validateSurveyInfo(undefined);
      expect(value).toBeUndefined();
      expect(error).toBeUndefined();
    });

    it("should fail on invalid question", () => {
      surveyInfo[0].question = null;
      const { error } = validateSurveyInfo(surveyInfo);
      expect(error).toBeInstanceOf(Joi.ValidationError);
    });

    it("should fail on question with 2 or less characters", () => {
      surveyInfo[0].question = "Hi";
      const { error } = validateSurveyInfo(surveyInfo);
      expect(error).toBeInstanceOf(Joi.ValidationError);
    });

    it("should fail on null possibleAnswers", () => {
      surveyInfo[0].possibleAnswers = null;
      const { error } = validateSurveyInfo(surveyInfo);
      expect(error).toBeInstanceOf(Joi.ValidationError);
    });

    it("should fail on possibleAnswers with 1 element", async () => {
      surveyInfo[0].possibleAnswers = [faker.random.words(1)];
      const { error } = validateSurveyInfo(surveyInfo);
      expect(error).toBeInstanceOf(Joi.ValidationError);
    });

    it("should pass on valid survey", async () => {
      const { error, value } = validateSurveyInfo(surveyInfo);
      console.log(JSON.stringify(error, null, 2));
      expect(error).toBeUndefined();
      expect(value).toBeTruthy();
    });
  });
});
