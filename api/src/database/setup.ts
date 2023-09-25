import { db } from "@/database/mongo";

/**
 * Used for database setup...
 */
async function setup() {
    // Cache collection
    const cache = await db.createCollection("cache");

    // Set cache to expire in 1 day (Note: this can be run multiple times in sequence, it won't cause any issues)
    await cache.createIndex({ parseDate: 1 }, { expireAfterSeconds: 60 * 60 * 24 });
}

export default setup;
