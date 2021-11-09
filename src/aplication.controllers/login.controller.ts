import express from "express";
import { encodeToken } from "../infrastructure.express/middleware/jwt.authenticator";

// Generates and returns a JWT access token
export const jwtLogin: express.RequestHandler = (req, res) => {
  const { user } = req.body;
  const accessToken = encodeToken({ userId: user });
  return res.json({ accessToken });
};
