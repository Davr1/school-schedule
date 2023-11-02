import type { Filter } from "mongodb";

import { AbsenceLesson, BakalariLesson, BakalariLessonType, NormalLesson, RemovedLesson } from "@/classes/bakalari";
import Schedule from "@/classes/schedule";
import { cache } from "@/database/mongo";
import type { Cache } from "@/database/mongo/cache";

/**
 * Get Bakalari schedules from the database
 *
 * @param filter The filter to use
 */
async function getBakalari(filter: Filter<Cache>): Promise<Schedule<BakalariLesson>[]> {
    // Get all the days from the database that match the type, value and date
    const days = await cache.find(filter).toArray();

    // Set the correct prototypes for the days and lessons
    days.forEach((day) => {
        Object.setPrototypeOf(day, Schedule.prototype);

        day.periods.forEach((period) =>
            period.forEach((lesson) => {
                if (lesson.type === BakalariLessonType.Normal) Object.setPrototypeOf(lesson, NormalLesson.prototype);
                else if (lesson.type === BakalariLessonType.Removed) Object.setPrototypeOf(lesson, RemovedLesson.prototype);
                else if (lesson.type === BakalariLessonType.Absence) Object.setPrototypeOf(lesson, AbsenceLesson.prototype);
                else throw new Error(`Found unknown lesson type: ${lesson.type}`);
            })
        );
    });

    return days;
}

export default getBakalari;
