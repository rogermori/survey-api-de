import { env } from "../lib/env";

export default {
  env: env("NODE_ENV"),
  port: env("PORT"),
  hostname: `${env("HOST")}:${env("PORT")}`,
  mongodb: {
    uri: env("MONGODB_URI"),
    db: "survey",
  },
  secretKey: "c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e",
  signals: ["SIGTERM", "SIGINT", "unhandledRejection", "uncaughtException"],
  api: { version: { "2021-11-01": "/2021-11-01" } },
  defaults: {
    query: {
      _page: 0,
      _limit: 100,
    },
    context: {
      length: 6,
    },
    survey: {
      question: {
        min: 3,
        max: 256,
        limit: 100,
      },
      possibleAnswers: {
        min: 2,
        max: 100,
        answer: {
          min: 1,
          max: 64,
        },
      },
      response: {
        limit: 100,
      },
    },
  },
};
