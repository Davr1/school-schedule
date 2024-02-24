import { GridFSBucket, MongoClient } from "mongodb";

import type { ScheduleJSON, SSSVTJSON } from "@/schemas";

export const client = new MongoClient(process.env.MONGO_URI ?? "mongodb://localhost:27017");
await client.connect();

export const db = client.db("school-schedule");

// Collections
export const bakalari = db.collection<ScheduleJSON & { fetchDate: Date }>("bakalari");
export const sssvt = db.collection<SSSVTJSON>("sssvt");

// Indexes
await bakalari.createIndex({ date: 1, detail: 1 });
await sssvt.createIndex({ date: 1 });

// GridFS
export const fs = new GridFSBucket(db);
