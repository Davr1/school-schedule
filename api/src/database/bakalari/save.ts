import type Bakalari from "@/classes/bakalari";
import { db } from "@/database/mongo";

async function saveBakalari(schedule: Bakalari) {
    const cache = db.collection("cache");

    // Set cache to expire in 1 day (Note: this can be run multiple times in sequence, it won't cause any issues)
    await cache.createIndex({ parseDate: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

    // 1. Cache - Applies to all types
    await cache.insertOne({
        ...schedule,
        parseDate: new Date()
    });
}

export default saveBakalari;
