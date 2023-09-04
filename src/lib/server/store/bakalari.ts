import type { Redis } from "ioredis";

import type Bakalari from "$lib/school/bakalari";
import { BakalariScheduleType } from "$lib/school/bakalari";
import type { LessonType } from "$lib/school/bakalari/lesson";
import serializeDate from "$lib/server/store/date";
import storeNormal from "$lib/server/store/normal";
import storeRemoved from "$lib/server/store/removed";

/** Flattened lesson object */
export interface FlatLesson {
    /** Type of the lesson (follows the bakalari type) */
    type: LessonType;

    /** The date (as a timestamp with just the date [UTC]) */
    date: number;

    /** The period index (0-9) */
    period: number;

    /** Class in the lesson */
    class: string;
}

/**
 * Flatten and store a Bakalari instance in redis
 *
 * @param bakalari The Bakalari instance to store
 */
function storeBakalari(bakalari: Bakalari, redis: Redis) {
    if (bakalari.type !== BakalariScheduleType.Class) throw new Error("Non-class schedules aren't supported");

    // Keep all the promises here so they can be awaited at the end at once
    const promises: Promise<unknown>[] = [];

    Object.values(bakalari.days).forEach((day) => {
        const { date } = day;
        if (!date) throw new Error("Permanent schedules aren't supported");

        // If there's a full day event, store it (global, not per class. don't think full days are class specific)
        const key = `schedule:bakalari:day:${serializeDate(date)}:${bakalari.value}`;
        if (day.event) promises.push(redis.set(key, day.event));

        // Loop through all the periods (and lessons) to store them
        day.periods.forEach((period, periodIndex) => {
            promises.push(
                // Store all the lessons in this period (await at the end too....)
                ...period.map(async (lesson) => {
                    if (lesson.isNormal()) return storeNormal(lesson, bakalari.value, date, periodIndex, redis);
                    else if (lesson.isRemoved()) return storeRemoved(lesson, bakalari.value, date, periodIndex, redis);
                })
            );
        });
    });

    // Return a promise that resolves when all the promises are resolved
    return Promise.all(promises);
}

export default storeBakalari;
