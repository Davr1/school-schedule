import Bakalari, { BakalariType } from "@/classes/bakalari";
import BakalariDay from "@/classes/bakalari/day";
import { AbsenceLesson, LessonType, NormalLesson, RemovedLesson } from "@/classes/bakalari/lesson";
import { cache, client } from "@/database/mongo";

/**
 * Get a Bakalari schedule from the database
 * @param type Type of the schedule (Class, Teacher, Room)
 * @param value Value of the schedule (Class, teacher or room id)
 * @param date A day in the week of the schedule or null for a permanent schedule
 */
async function getBakalari(type: BakalariType, value: string, date: Date | null) {
    // Get the start and end dates of the week
    const start = date ? new Date(date) : null;
    const end = date ? new Date(date) : null;

    start?.setDate(start.getDate() - start.getDay());
    end?.setDate(start!.getDate() + 6);

    // Get all the days from the database that match the type, value and date
    const days = await cache.find({ type, value, date: date ? { $gte: start, $lt: end } : null }).toArray();

    // If there are no days, return null
    if (!days.length) return null;

    // Set the correct prototypes for the days and lessons
    days.forEach((day) => {
        Object.setPrototypeOf(day, BakalariDay.prototype);

        day.periods.forEach((period) =>
            period.forEach((lesson) => {
                if (lesson.type === LessonType.Normal) Object.setPrototypeOf(lesson, NormalLesson.prototype);
                else if (lesson.type === LessonType.Removed) Object.setPrototypeOf(lesson, RemovedLesson.prototype);
                else if (lesson.type === LessonType.Absence) Object.setPrototypeOf(lesson, AbsenceLesson.prototype);
                else throw new Error(`Found unknown lesson type: ${lesson.type}`);
            })
        );
    });

    // Create a new Bakalari schedule
    return new Bakalari(type, value, days);
}

export default getBakalari;

if (import.meta.main) {
    getBakalari(BakalariType.Class, "P3.B", new Date())
        .then(console.log)
        .then((a) => client.close());
}
