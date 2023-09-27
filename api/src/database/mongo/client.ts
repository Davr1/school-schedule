import { MongoClient } from "mongodb";

// Mongo Client
const client = new MongoClient("mongodb://localhost:27017", { appName: "school-schedule" });
await client.connect();

export default client;

// Database
export const db = client.db("school-schedule");
