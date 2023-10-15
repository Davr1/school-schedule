import type Bakalari from "@/classes/bakalari";
import { BakalariType } from "@/classes/bakalari";
import { events } from "@/database/mongo";

/**
 * Store full day event(s) into the database for a given schedule
 * @param schedule The schedule(s) to store
 */
async function storeEvent(schedules: Bakalari | Bakalari[]) {
    // Convert to an array if it isn't already
    if (!Array.isArray(schedules)) schedules = [schedules];

    // Loop through each schedule
    for (const { date, event, type, value } of schedules) {
        // Don't bother if the date is a number (permanent schedule) or if it isn't a class schedule
        if (typeof date === "number" || type !== BakalariType.Class) continue;

        // Remove the class from any non-matching events
        await events.updateMany(
            { date, classes: { $elemMatch: { $eq: value } }, event: event ? { $ne: event } : {} },
            { $pull: { classes: value } }
        );

        // If there's no event, don't bother continuing
        if (event === null) return;

        // Add the class to the event (if it isn't already there) and create the event if it doesn't exist
        await events.updateOne({ date, event }, { $addToSet: { classes: value }, $setOnInsert: { date, event } }, { upsert: true });
    }

    // Cleanup any events that don't have any classes
    await events.deleteMany({ classes: { $size: 0 } });
}

export default storeEvent;
