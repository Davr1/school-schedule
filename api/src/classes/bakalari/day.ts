import type { Lesson } from "@/classes/bakalari/lesson";

/** Days of the week... */
export const enum Day {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

/** School days */
export type SchoolDay = Day.Monday | Day.Tuesday | Day.Wednesday | Day.Thursday | Day.Friday;

/** Possible lessons in a period */
export type Period = readonly [] | readonly [Lesson] | readonly [Lesson, Lesson];

/** Bakalari schedule day */
class BakalariDay {
    /** The day of the week */
    readonly day: SchoolDay;

    /** The date of the day, can be null if the schedule is permanent */
    readonly date: Date | null;

    /** The periods of the day */
    readonly periods: Period[];

    /** Possible full day event */
    readonly event: string | null;

    /** Create a new Bakalari day */
    constructor(day: SchoolDay, date: Date | null, periods: Period[], event: string | null = null) {
        this.day = day;
        this.date = date;
        this.periods = periods;
        this.event = event;
    }
}

export default BakalariDay;
