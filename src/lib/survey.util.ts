import faker from "faker";
import { SurveyInfoInput } from "../infrastructure.mongodb/types";

export const createRandomSurvey = (
  words = 4,
  nroAnswers = 3
): SurveyInfoInput => ({
  question: faker.lorem.words(words),
  possibleAnswers: [...Array(nroAnswers).keys()].reduce((a) => {
    a.push(faker.random.words(1));
    return a;
  }, []),
});

export const createAListOfSurveys = (
  nroSurveys = 20,
  words = 5,
  nroAnswers = 8
): SurveyInfoInput[] => {
  return [...Array(nroSurveys).keys()].reduce((a) => {
    const maxNroAnswers = randomIntFromInterval(2, nroAnswers);
    const maxNroWords = randomIntFromInterval(3, words);
    a.push(createRandomSurvey(maxNroWords, maxNroAnswers));
    return a;
  }, []);
};

export const generateRandomSurveys = () =>
  createAListOfSurveys(randomIntFromInterval(12, 24));

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
