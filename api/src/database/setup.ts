import { db } from "@/database/mongo";

/**
 * Used for database setup...
 */
async function setup() {
    // Cache collection
    const cache = await db.createCollection("cache");

    await cache.createIndexes([
        // Set cache to expire in 1 day (Note: this can be run multiple times in sequence, it won't cause any issues)
        { key: { parseDate: 1 }, expireAfterSeconds: 60 * 60 * 24 },

        // Index the date property
        { key: { date: 1 } }
    ]);
}

export default setup;
