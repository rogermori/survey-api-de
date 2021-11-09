export const simulateAnswerList = (surveys: any[]) =>
  surveys.reduce((answers, survey) => {
    const { surveyId, possibleAnswers } = survey;
    const possibleAnswer =
      possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
    answers.push({
      surveyId,
      answerId: possibleAnswer["answerId"],
      response: possibleAnswer["answer"],
      status: Math.random() < 0.5 ? "completed" : "pending",
    });
    return answers;
  }, []);
