import type Bakalari from "@/classes/bakalari";
import { BakalariScheduleType } from "@/classes/bakalari";
import storeEvents from "@/database/bakalari/event";
import { cache } from "@/database/mongo";

async function saveBakalari(schedule: Bakalari) {
    // 1. Cache - Applies to all types
    await cache.insertOne({
        ...schedule,
        date: schedule.date, // This is a getter so it won't get stored automatically
        parseDate: new Date()
    });

    // 2. Store - Only for class schedules
    if (schedule.type !== BakalariScheduleType.Class) return;

    // Full day events
    await storeEvents(schedule);
}

export default saveBakalari;
