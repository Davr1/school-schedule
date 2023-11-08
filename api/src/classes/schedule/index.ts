import type { Details } from "@/classes/details";
import Lesson from "@/classes/schedule/lesson";
import type { SSSVTClass } from "@/classes/sssvt";

/** Type of the schedule */
export const enum ScheduleType {
    Class = "Class",
    Teacher = "Teacher",
    Room = "Room"
}

/** Possible lessons in a period, will usually just be between 0 and 2 */
export type Period = Lesson[];

/** Schedule for a day */
class Schedule {
    constructor(
        /** Type of the schedule (Class, Teacher, Room) */
        readonly type: ScheduleType,

        /** Details of the schedule, should match the type */
        readonly details: Details,

        /**
         * The date of the day
         *
         * For permanent schedules this will be the day index (a number between 0 and 6)
         */
        readonly date: Date | number,

        /** The periods of the day */
        readonly periods: Period[],

        /** Possible full day event */
        readonly event: string | null = null
    ) {}

    /** Create a new Schedule from an object of the same structure */
    static fromObject(object: Schedule) {
        return new this(object.type, object.details, object.date, object.periods, object.event);
    }

    /** Add the SSSVT changes to the schedule */
    merge(sssvt: SSSVTClass) {
        this.periods.forEach((period, index) => {
            // Get the SSSVT equivalent of the period
            const sssvtPeriod = sssvt[index] ?? [];

            // Match the lessons by group
            period.forEach((lesson, index) => {
                // If the bakalari lesson is empty, remove it completely from the schedule
                const { bakalari } = lesson;
                if (!bakalari) return void period.splice(index, 1);

                // Find the matching SSSVT lesson
                const sssvtLesson = bakalari?.isNormal()
                    ? sssvtPeriod.find((s) => !s.group || s.group === bakalari.groups[0]?.number)
                    : sssvtPeriod[index];

                // Set the SSSVT lesson
                lesson.sssvt = sssvtLesson ?? null;
            });

            // Find the SSSVT lessons that don't have a matching bakalari lesson
            sssvtPeriod.forEach((lesson) => {
                // Try to find this inside the merged lessons
                const mergedLesson = period.find((l) => l.sssvt === lesson);

                // If there's no merged lesson, add it
                if (!mergedLesson) period.push(new Lesson(null, lesson));
            });
        });
    }
}

export default Schedule;
