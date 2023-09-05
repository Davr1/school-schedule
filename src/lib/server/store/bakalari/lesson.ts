import type Redis from "ioredis";

import type { Lesson, LessonType } from "$lib/school/bakalari/lesson";
import storeNormal from "$lib/server/store/bakalari/normal";
import storeRemoved from "$lib/server/store/bakalari/removed";
import serializeDate from "$lib/server/store/date";

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
 * Store a lesson into redis
 *
 * @param className The class to store the lessons for
 * @param date Date of the lesson
 * @param lesson The lesson key to add to the store
 * @param redis The redis instance to store the lesson in
 */
function storeLesson(lesson: Lesson, className: string, date: Date, period: number, redis: Redis) {
    // Call the appropriate function based on the type of the lesson
    let result: readonly [string, Promise<unknown>] | undefined;
    if (lesson.isNormal()) result = storeNormal(lesson, className, date, period, redis);
    else if (lesson.isRemoved()) result = storeRemoved(lesson, className, date, period, redis);

    // Don't continue if there's no result
    if (!result) return;

    return Promise.all([
        // Resolve once the lesson is stored
        result[1],

        // Store the lesson name
        redis.sadd(`schedule:bakalari:lessons:${className}:${serializeDate(date)}`, result[0])
    ]);
}

export default storeLesson;
