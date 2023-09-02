/** Type of the schedule */
export const enum Type {
    Class = "class",
    Teacher = "teacher",
    Room = "room"
}

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

export type WeekDay = Day.Monday | Day.Tuesday | Day.Wednesday | Day.Thursday | Day.Friday;

/**
 * Bakalari schedule
 *
 * If you want to parse the schedule from HTML, use the `scrapeBakalari` function from `$lib/school/parser/bakalari`
 */
class Bakalari {
    /** Type of the schedule (Class, Teacher, Room) */
    readonly type: Type;

    /** Value of the schedule (Class name, teacher's name or room number) */
    readonly value: string;

    /** Is the schedule showing a permanent version */
    readonly permanent: boolean;

    /**
     * Date of the first day in the schedule (usually Monday)
     *
     * If the schedule is permanent, this will be null
     */
    readonly start: Date | null;

    /**
     * Date of the last day in the schedule (usually Friday)
     *
     * If the schedule is permanent, this will be null
     */
    readonly end: Date | null;

    /** The schedule for the week */
    readonly schedule: Record<WeekDay, any[][]>;

    /**
     * Create a new Bakalari schedule
     */
    constructor(
        /** Type of the schedule */
        type: Type,

        /** Value of the schedule */
        value: string,

        /** Is the schedule permanent */
        permanent: boolean,

        /** Date of the first and last day in the schedule */
        dates: { start: Date | null; end: Date | null },

        /** The contents of the schedule */
        schedule: Record<WeekDay, any[][]>
    ) {
        this.type = type;
        this.value = value;
        this.permanent = permanent;

        this.start = dates.start;
        this.end = dates.end;

        this.schedule = schedule;
    }

    // private patches: Record<WeekDay, boolean> = {
    //     [Day.Monday]: false,
    //     [Day.Tuesday]: false,
    //     [Day.Wednesday]: false,
    //     [Day.Thursday]: false,
    //     [Day.Friday]: false
    // };

    // /**
    //  * Patch the schedule with the given substitutions
    //  *
    //  * @param subs The substitutions to patch the schedule with
    //  */
    // patch(subs: Record<string, any[][]>) {
    //     throw new Error("Not implemented");
    // }
}

export default Bakalari;

// Ignore this, will be used later for patching. just copied it from stackoverflow cuz i'll need it and would forget it
// type Writeable<T> = { -readonly [P in keyof T]: T[P] extends object ? Writeable<T[P]> : T[P] };
