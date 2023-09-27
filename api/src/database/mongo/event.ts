import { db } from "@/database/mongo";

/** Event collection schema */
interface Event {
    event: string;
    date: Date;
    classes: string[];
}

/** Event collection */
const events = db.collection<Event>("event");

// Setup indexes (Note: Won't do anything if they already exist)
await events.createIndexes([
    // Index the date property
    { key: { date: 1, event: 1 }, unique: true }
]);

export default events;
