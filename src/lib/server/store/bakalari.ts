import type { Redis } from "ioredis";

import type Bakalari from "$lib/school/bakalari";
import { BakalariScheduleType } from "$lib/school/bakalari";
import type { LessonType } from "$lib/school/bakalari/lesson";
import serializeDate from "$lib/server/store/date";

/** Flattened normal lesson */
interface FlatLesson {
    /** Type of the lesson (follows the bakalari type) */
    type: LessonType;

    /** The date (as a timestamp with just the date [UTC]) */
    date: number;

    /** The period index (0-9) */
    period: number;

    /** Subject abbreviation */
    subject: string;

    /** Teacher abbreviation */
    teacher: string;

    /** The room the lesson is taught in */
    room: string;

    /** Class in the lesson */
    class: string;

    /** The group the lesson targets, will be 0 for the whole class */
    group: number;

    /** The topic (will be 0 if there's nothing set) */
    topic: string | 0;

    /** Whether there was a change (details won't be preserved) */
    change: boolean;
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

        const dateString = serializeDate(date);

        const timestamp = date.getTime();

        // If there's a full day event, store it (global, not per class. don't think full days are class specific)
        const key = `schedule:bakalari:day:${dateString}:${bakalari.value}`;
        if (day.event) promises.push(redis.set(key, day.event));

        day.periods.forEach((period, periodIndex) => {
            period.forEach((lesson) => {
                const key = `schedule:bakalari:lesson:${dateString}:${bakalari.value}:${periodIndex}`;

                // Only keep whether a change happened. The details are irrelevant
                const change = lesson.change !== null;

                if (lesson.isNormal()) {
                    // Only keep the abbreviations
                    const subject = lesson.subject.abbreviation!;
                    const teacher = lesson.teacher.abbreviation!;

                    // Save the metadata for the subject and teacher
                    promises.push(redis.set(`schedule:bakalari:subject:${subject}`, lesson.subject.name!));
                    promises.push(redis.set(`schedule:bakalari:teacher:${teacher}`, lesson.teacher.name!));

                    // Get the group in the lesson, or 0 if there's nothing set
                    const group = lesson.groups[0]?.number ?? 0;

                    // The topic is either the topic or 0 if there's nothing set
                    const topic = lesson.topic ?? 0;

                    // Create the object and store it (don't await just yet, do it at the end)
                    const object: FlatLesson = {
                        type: lesson.type,
                        date: timestamp,
                        period: periodIndex,
                        subject,
                        teacher,
                        room: lesson.room,
                        class: bakalari.value,
                        group: group,
                        topic,
                        change
                    };
                    promises.push(redis.call("JSON.SET", key, "$", JSON.stringify(object)));
                }
            });
        });
    });

    // Return a promise that resolves when all the promises are resolved
    return Promise.all(promises);
}

export default storeBakalari;
