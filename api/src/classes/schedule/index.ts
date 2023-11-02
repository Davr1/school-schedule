import type { BakalariLesson } from "@/classes/bakalari";
import Lesson from "@/classes/schedule/lesson";
import type { SSSVTClass } from "@/classes/sssvt";
import type { LessonChange } from "@/classes/sssvt/change";

/** Type of the schedule */
export const enum ScheduleType {
    Class = "Class",
    Teacher = "Teacher",
    Room = "Room"
}

/** Possible lessons in a period */
export type SchedulePeriod<LessonType> = readonly [] | readonly [LessonType] | readonly [LessonType, LessonType];

/** Schedule for a day */
class Schedule<LessonType = Lesson> {
    constructor(
        /** Type of the schedule (Class, Teacher, Room) */
        readonly type: ScheduleType,

        /** Value of the schedule (class, teacher, or room id) */
        readonly value: string,

        /**
         * The date of the day
         *
         * For permanent schedules this will be the day index (a number between 0 and 6)
         */
        readonly date: Date | number,

        /** The periods of the day */
        readonly periods: SchedulePeriod<LessonType>[],

        /** Possible full day event */
        readonly event: string | null = null
    ) {}

    /** Create a new Schedule from an object of the same structure */
    static fromObject<T>(object: Schedule<T>) {
        return new this(object.type, object.value, object.date, object.periods, object.event);
    }

    /** Merge a Bakalari Schedule with SSSVT class substitutions */
    static merge(bakalari: Schedule<BakalariLesson>, sssvt: SSSVTClass) {
        const periods = bakalari.periods.map((period, index) => {
            const sssvtPeriod = sssvt[index] ?? [];

            // Match the lessons by group
            const findMatch = (bk?: BakalariLesson, s?: LessonChange) =>
                bk?.isNormal() ? sssvtPeriod.find((s) => !s.group || s.group === bk.groups[0]?.number) : s;
            const sssvtLesson1 = findMatch(period[0], sssvtPeriod[0]);
            const sssvtLesson2 = findMatch(period[1], sssvtPeriod[1]);

            // Make the rest separate lessons
            const rest = sssvtPeriod.filter((s) => s !== sssvtLesson1 && s !== sssvtLesson2);

            // Create the new lessons
            const lessons = [
                new Lesson(period[0] ?? null, sssvtLesson1 ?? null),
                new Lesson(period[1] ?? null, sssvtLesson2 ?? null),
                ...rest.map((s) => new Lesson(null, s))
            ].filter((l) => !l.empty);

            // Return the new period (ts is dumb here, so as unknown as ...)
            return lessons as unknown as SchedulePeriod<Lesson>;
        });

        // Return the new schedule
        return new Schedule(bakalari.type, bakalari.value, bakalari.date, periods, bakalari.event);
    }
}

export default Schedule;
