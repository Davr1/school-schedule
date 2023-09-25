import type Bakalari from "@/classes/bakalari";
import { BakalariScheduleType } from "@/classes/bakalari";
import storeEvents from "@/database/bakalari/event";
import { db } from "@/database/mongo";

async function saveBakalari(schedule: Bakalari) {
    const cache = db.collection("cache");

    // 1. Cache - Applies to all types
    await cache.insertOne({
        ...schedule,
        parseDate: new Date()
    });

    // 2. Store - Only for class schedules
    if (schedule.type !== BakalariScheduleType.Class) return;

    // Full day events
    await storeEvents(schedule);
}

export default saveBakalari;
