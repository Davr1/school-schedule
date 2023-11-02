import type { BakalariLesson } from "@/classes/bakalari";
import type Schedule from "@/classes/schedule";
import storeEvent from "@/database/bakalari/event";
import { cache } from "@/database/mongo";

async function saveBakalari(schedules: Schedule<BakalariLesson> | Schedule<BakalariLesson>[]) {
    // Convert to an array if it isn't already
    if (!Array.isArray(schedules)) schedules = [schedules];

    // Don't bother if there's nothing to save
    if (schedules.length === 0) return;

    // 1. Cache days - Applies to all types
    await cache.insertMany(
        schedules.map((schedule) => ({
            ...schedule,
            parseDate: new Date()
        }))
    );

    // 2. Full day events
    await storeEvent(schedules);
}

export default saveBakalari;
