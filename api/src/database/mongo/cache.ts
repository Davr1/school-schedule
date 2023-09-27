import type Bakalari from "@/classes/bakalari";
import { db } from "@/database/mongo/client";

/** Cache collection schema */
interface Cache extends Bakalari {
    parseDate: Date;
    date: Date | null;
}

/** Cache collection */
const cache = db.collection<Cache>("cache");

// Setup indexes (Note: Won't do anything if they already exist)
await cache.createIndexes([
    // Set cache to expire in 1 day after parsing
    { key: { parseDate: 1 }, expireAfterSeconds: 60 * 60 * 24 },

    // Index the date and value properties
    { key: { date: 1, value: 1 } /*, unique: true */ }
]);

export default cache;
