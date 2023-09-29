import { MongoClient } from "mongodb";

// Get the connection url from the environment
const url = process.env.MONGO ?? "mongodb://localhost:27017";

// Mongo Client
const client = new MongoClient(url, { appName: "school-schedule" });
await client.connect();

export default client;

// Database
export const db = client.db("school-schedule");
