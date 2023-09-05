import type Redis from "ioredis";

import serializeDate from "$lib/server/store/date";

/**
 * Store that all lessons that exist for a class
 *
 * @param className The class to store the lessons for
 * @param date Date of the lesson
 * @param lesson The lesson key to add to the store
 * @param redis The redis instance to store the lesson in
 */
function storeLesson(className: string, date: Date, lesson: string, redis: Redis) {
    // Store the lesson
    return redis.sadd(`schedule:bakalari:lessons:${className}:${serializeDate(date)}`, lesson);
}

export default storeLesson;
