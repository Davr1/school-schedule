import type Redis from "ioredis";

import serializeDate from "$lib/server/store/date";

/**
 * Store a full day event into redis
 *
 * @param event The event to store
 * @param date The date of the event
 * @param className The class the event is for
 * @param redis The redis instance to store the event in
 */
function storeEvent(event: string | null, date: Date, className: string, redis: Redis) {
    const key = `schedule:bakalari:day:${serializeDate(date)}:${className}`;

    // If there is an event store it, otherwise delete it
    if (event !== null) return redis.set(key, event);
    else return redis.del(key);
}

export default storeEvent;
