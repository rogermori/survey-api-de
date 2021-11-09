import express from "express";

export const asyncCatchHandler =
  (requestHandler: Function): express.RequestHandler =>
  (req, res, next) => {
    requestHandler(req, res, next).catch(next);
  };
