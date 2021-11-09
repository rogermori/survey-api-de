import { MongoClient } from "mongodb";
import config from "../config/configuration";

export const mongoClient = new MongoClient(config.mongodb.uri);

export const mongoDB = () => mongoClient.db(config.mongodb.db);
