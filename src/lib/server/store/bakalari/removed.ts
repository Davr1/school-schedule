import type Redis from "ioredis";

import type { LessonType, RemovedLesson } from "$lib/school/bakalari/lesson";
import type { FlatLesson } from "$lib/server/store/bakalari";
import storeLesson from "$lib/server/store/bakalari/lesson";
import serializeDate from "$lib/server/store/date";

/** Flattened removed lesson */
interface FlatRemovedLesson extends FlatLesson {
    /** Type of the lesson (follows the bakalari type) */
    type: LessonType.Removed;

    /** The date (as a timestamp with just the date [UTC]) */
    date: number;

    /** The period index (0-9) */
    period: number;

    /** Class in the lesson */
    class: string;
}

/**
 * Store a normal lesson into redis
 *
 * @param lesson The lesson to store
 * @param className The class in which the lesson is taught
 * @param date The date of the lesson
 * @param period Which period the lesson is in
 * @param redis The redis instance to store the lesson in
 */
function storeRemoved(lesson: RemovedLesson, className: string, date: Date, period: number, redis: Redis) {
    /** The key to store this lesson under in redis */
    const key = `schedule:bakalari:lesson:${className}:removed:${serializeDate(date)}:${period}`;

    // Create the object and store it
    const object: FlatRemovedLesson = {
        type: lesson.type,
        date: date.getTime(),
        period,
        class: className
    };

    return Promise.all([
        // Store the lesson
        redis.call("JSON.SET", key, "$", JSON.stringify(object)),

        // Remember the lesson
        storeLesson(className, date, key, redis)
    ]);
}

export default storeRemoved;
