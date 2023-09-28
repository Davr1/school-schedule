import type Bakalari from "@/classes/bakalari";
import { BakalariScheduleType } from "@/classes/bakalari";
import storeEvents from "@/database/bakalari/event";
import { cache } from "@/database/mongo";

async function saveBakalari(schedule: Bakalari) {
    // 1. Cache days - Applies to all types
    await cache.insertMany(
        Object.values(schedule.days).map((day) => ({
            ...day,
            parseDate: new Date(),
            type: schedule.type,
            value: schedule.value
        }))
    );

    // 2. Store - Only for class schedules
    if (schedule.type !== BakalariScheduleType.Class) return;

    // Full day events
    await storeEvents(schedule);
}

export default saveBakalari;
