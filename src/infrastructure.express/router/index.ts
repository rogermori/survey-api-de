import fs from "fs";
import express from "express";

const router = express.Router();

export default function createRouter(app: express.Express) {
  fs.readdirSync(__dirname).forEach(function ($route: string) {
    const route = $route.split(".")[0];
    if (route === "index") return;
    const routeHandler = require(`./${route}`);
    router.use(`/${route}`, routeHandler.default(app));
  });
  return router;
}
