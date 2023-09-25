import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017", { appName: "school-schedule" });
await client.connect();

export default client;

export const db = client.db("school-schedule");
