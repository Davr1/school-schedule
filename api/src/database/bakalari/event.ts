import type Bakalari from "@/classes/bakalari";
import { events } from "@/database/mongo";

/**
 * Store all full day events into the database for a given schedule
 * @param schedule The schedule
 */
async function storeEvents(schedule: Bakalari) {
    for (const { event, date } of Object.values(schedule.days)) {
        if (!date) continue; // Obv skip permanent schedules

        // Remove the class from any non-matching events
        await events.updateMany(
            { date, classes: { $elemMatch: { $eq: schedule.value } }, event: event ? { $ne: event } : {} },
            { $pull: { classes: schedule.value } }
        );

        // If there's no event, don't bother continuing
        if (event === null) continue;

        // Add the class to the event (if it isn't already there) and create the event if it doesn't exist
        await events.updateOne(
            { date, event },
            { $addToSet: { classes: schedule.value }, $setOnInsert: { date, event } },
            { upsert: true }
        );
    }

    // Cleanup any events that don't have any classes
    await events.deleteMany({ classes: { $size: 0 } });
}

export default storeEvents;
