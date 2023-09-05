import type { Redis } from "ioredis";

import type Bakalari from "$lib/school/bakalari";
import { BakalariScheduleType } from "$lib/school/bakalari";
import type { LessonType } from "$lib/school/bakalari/lesson";
import storeEvent from "$lib/server/store/bakalari/event";
import storeNormal from "$lib/server/store/bakalari/normal";
import storeRemoved from "$lib/server/store/bakalari/removed";

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

    // Keep all the promises so they can be awaited at the end at once
    const promises = Object.values(bakalari.days).flatMap((day) => {
        const { date } = day;
        if (!date) throw new Error("Permanent schedules aren't supported");

        // Loop through all the periods (and lessons) to store them
        const promises: (Promise<unknown> | undefined)[] = day.periods.flatMap((period, periodIndex) =>
            period.map((lesson) => {
                if (lesson.isNormal()) return storeNormal(lesson, bakalari.value, date, periodIndex, redis);
                else if (lesson.isRemoved()) return storeRemoved(lesson, bakalari.value, date, periodIndex, redis);
            })
        );

        // Store the info about an event (if there is one)
        promises.push(storeEvent(day.event, date, bakalari.value, redis));

        // Return the promises so they can be awaited at the end
        return promises;
    });

    // Return a promise that resolves when all the promises are resolved
    return Promise.all(promises);
}

export default storeBakalari;
