import type Redis from "ioredis";

import type { LessonType, NormalLesson } from "$lib/school/bakalari/lesson";
import type { FlatLesson } from "$lib/server/store/bakalari/lesson";
import storeMetadata, { MetadataType } from "$lib/server/store/bakalari/metadata";
import serializeDate from "$lib/server/store/date";

/** Flattened normal lesson */
interface FlatNormalLesson extends FlatLesson {
    /** Type of the lesson (follows the bakalari type) */
    type: LessonType.Normal;

    /** Subject abbreviation */
    subject: string;

    /** Teacher abbreviation */
    teacher: string;

    /** The room the lesson is taught in */
    room: string;

    /** The group the lesson targets, will be 0 for the whole class */
    group: number;

    /** The topic (will be 0 if there's nothing set) */
    topic: string | 0;

    /** Whether there was a change (details won't be preserved) */
    change: boolean;
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
function storeNormal(lesson: NormalLesson, className: string, date: Date, period: number, redis: Redis) {
    /** Whether there was a change, details are dropped cuz they're useless */
    const change = lesson.change !== null;

    // Only keep the abbreviations
    const subject = lesson.subject.abbreviation!;
    const teacher = lesson.teacher.abbreviation!;

    // Get the group in the lesson, or 0 if there's nothing set
    const group = lesson.groups[0]?.number ?? 0;

    /** The key to store this lesson under in redis */
    const key = `schedule:bakalari:lesson:${className}:${group}:${serializeDate(date)}:${period}`;

    // The topic is either the topic or 0 if there's nothing set
    const topic = lesson.topic ?? 0;

    // Create the object and store it (don't await just yet, do it at the end)
    const object: FlatNormalLesson = {
        type: lesson.type,
        date: date.getTime(),
        period,
        subject,
        teacher,
        room: lesson.room,
        class: className,
        group: group,
        topic,
        change
    };

    // Return both the promise and key as a tuple
    return [
        key,

        Promise.all([
            // Run the redis command
            redis.hset(key, object),

            // Store the metadata
            storeMetadata(MetadataType.Subject, subject, lesson.subject.name!, redis),
            storeMetadata(MetadataType.Teacher, teacher, lesson.teacher.name!, redis)
        ])
    ] as const;
}

export default storeNormal;
