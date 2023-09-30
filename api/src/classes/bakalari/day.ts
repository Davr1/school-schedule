import type { Lesson } from "@/classes/bakalari/lesson";

/** Possible lessons in a period */
export type BakalariPeriod = readonly [] | readonly [Lesson] | readonly [Lesson, Lesson];

/** Bakalari schedule day */
class BakalariDay {
    constructor(
        /** The day of the week */
        readonly day: number,

        /** The date of the day, can be null if the schedule is permanent */
        readonly date: Date | null,

        /** The periods of the day */
        readonly periods: BakalariPeriod[],

        /** Possible full day event */
        readonly event: string | null = null
    ) {}

    /** Create a new BakalariDay from an object of the same structure */
    static fromObject(object: BakalariDay): BakalariDay {
        return new BakalariDay(object.day, object.date, object.periods, object.event);
    }
}

export default BakalariDay;
