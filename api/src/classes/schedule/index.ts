import type { DetailHandler, Details } from "@/classes/details";
import Lesson, { type LessonJSON } from "@/classes/schedule/lesson";
import type { SSSVTClass } from "@/classes/sssvt";

/** Type of the schedule */
export const enum ScheduleType {
    Class = "Class",
    Teacher = "Teacher",
    Room = "Room"
}

/** Possible lessons in a period, will usually just be between 0 and 2 */
export type Period = Lesson[];

/** Schedule serialized to JSON */
export type ScheduleJSON = Omit<Schedule, "toJSON" | "merge" | "details" | "date" | "periods"> & {
    details: string;
    date: string | number;
    periods: LessonJSON[][];
};

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

    /** Serialize the schedule to JSON */
    toJSON(): ScheduleJSON {
        const details = this.details.toString();
        const date = this.date instanceof Date ? this.date.toISOString() : this.date;

        return { ...this, details, date };
    }

    /** Deserialize the schedule from JSON */
    static fromJSON(json: ScheduleJSON, handler: DetailHandler) {
        // Find the details by id
        const details = handler.getDetail(json.details);
        if (!details) throw new Error("Details not found");

        // Parse the date
        const date = typeof json.date === "string" ? new Date(json.date) : json.date;

        // Parse each lesson in the periods
        const periods = json.periods.map((period) => period.map((lesson) => Lesson.fromJSON(lesson, handler)));

        return new Schedule(json.type, details, date, periods, json.event);
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
