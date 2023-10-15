import type { BakalariLesson } from "@/classes/bakalari/lesson";

/** Type of the schedule */
export const enum BakalariType {
    Class = "Class",
    Teacher = "Teacher",
    Room = "Room"
}

/** Possible lessons in a period */
export type BakalariPeriod = readonly [] | readonly [BakalariLesson] | readonly [BakalariLesson, BakalariLesson];

/** Bakalari schedule */
class Bakalari {
    constructor(
        /** Type of the schedule (Class, Teacher, Room) */
        readonly type: BakalariType,

        /** Value of the schedule (class, teacher, or room id) */
        readonly value: string,

        /**
         * The date of the day
         *
         * For permanent schedules this will be the day index (a number between 0 and 6)
         */
        readonly date: Date | number,

        /** The periods of the day */
        readonly periods: BakalariPeriod[],

        /** Possible full day event */
        readonly event: string | null = null
    ) {}

    /** Create a new Bakalari schedule from an object of the same structure */
    static fromObject(object: Bakalari) {
        return new this(object.type, object.value, object.date, object.periods, object.event);
    }
}

export default Bakalari;
