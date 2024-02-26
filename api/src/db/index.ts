import { GridFSBucket, type GridFSFile, MongoClient } from "mongodb";

import type { AnyBakalariLessonJSON, ScheduleJSON, SSSVTJSON } from "@/schemas";
import type { GroupJSON } from "@/schemas/group";

export type SSSVTBSON = Omit<SSSVTJSON, "date"> & { date: Date };
export type BakalariBSON = Omit<ScheduleJSON, "date"> & { date: Date; fetchDate: Date };
export type BakalariLessonJSON = AnyBakalariLessonJSON & { date: Date; period: number; groups: GroupJSON[] };

export const client = new MongoClient(process.env.MONGO_URI ?? "mongodb://localhost:27017");
await client.connect();

export const db = client.db("school-schedule");

// Collections
export const bakalari = db.collection<BakalariBSON>("bakalari");
export const sssvt = db.collection<SSSVTBSON>("sssvt");

// Indexes
await bakalari.createIndex({ date: 1, detail: 1 });
await sssvt.createIndex({ date: 1 });

// Views
export const bkEvents = await db.createCollection<{ date: Date; event: string }>("bakalari-events", {
    viewOn: "bakalari",
    pipeline: [
        { $match: { event: { $ne: null } } },

        // Group by date, and set the event to the first event (they're always the same)
        { $group: { _id: "$date", event: { $first: "$event" } } },
        { $project: { _id: 0, date: "$_id", event: 1 } }
    ]
});

export const bkLessons = await db.createCollection<BakalariLessonJSON>("bakalari-lessons", {
    viewOn: "bakalari",
    pipeline: [
        // Unwind the lessons
        { $unwind: { path: "$periods", includeArrayIndex: "period" } },
        { $unwind: "$periods" },

        // Set the date, period and class fields
        { $set: { "periods.bakalari.date": "$date", "periods.bakalari.period": "$period", "periods.bakalari.groups.class": "$detail" } },

        // If the groups are empty, add one with the class name and no number
        {
            $set: {
                "periods.bakalari.groups": {
                    $cond: {
                        if: {
                            $cond: {
                                if: { $isArray: "$periods.bakalari.groups" },
                                then: { $eq: [{ $size: "$periods.bakalari.groups" }, 0] },
                                else: true
                            }
                        },
                        then: [{ class: "$detail", number: null }],
                        else: "$periods.bakalari.groups"
                    }
                }
            }
        },

        { $replaceRoot: { newRoot: "$periods.bakalari" } }
    ]
});

// GridFS
export const fs = new GridFSBucket(db);
export const files = db.collection<GridFSFile>("fs.files");
