/** Days of the week... */
export const enum Day {
    Sunday, // Honestly this is here just for the 0 index...
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday // Not needed but whatever
}

type WeekDay = Day.Monday | Day.Tuesday | Day.Wednesday | Day.Thursday | Day.Friday;

/**
 * Bakalari schedule
 *
 * If you want to parse the schedule from HTML, use the `scrapeBakalari` function from `$lib/school/parser/bakalari`
 */
class Bakalari {
    /** The date of the first day in the schedule (Monday) */
    readonly start: Date;

    /** The date of the last day in the schedule (Friday) */
    readonly end: Date;

    /** The schedule for the week */
    readonly schedule: Record<Day, any[][]>;

    /**
     * Create a new Bakalari schedule
     */
    constructor(start: Date, end: Date, schedule: Record<Day, any[][]>) {
        this.start = start;
        this.end = end;
        this.schedule = schedule;
    }

    private patches: Record<WeekDay, boolean> = {
        [Day.Monday]: false,
        [Day.Tuesday]: false,
        [Day.Wednesday]: false,
        [Day.Thursday]: false,
        [Day.Friday]: false
    };

    /**
     * Patch the schedule with the given substitutions
     *
     * @param subs The substitutions to patch the schedule with
     */
    patch(subs: Record<string, any[][]>) {
        throw new Error("Not implemented");
    }
}

export default Bakalari;

// Ignore this, will be used later for patching. just copied it from stackoverflow cuz i'll need it and would forget it
type Writeable<T> = { -readonly [P in keyof T]: T[P] extends object ? Writeable<T[P]> : T[P] };
