import type BakalariDay from "@/classes/bakalari/day";

/** Type of the schedule */
export const enum BakalariType {
    Class = "Class",
    Teacher = "Teacher",
    Room = "Room"
}

/** Bakalari schedule */
class Bakalari {
    constructor(
        /** Type of the schedule (Class, Teacher, Room) */
        readonly type: BakalariType,

        /** Value of the schedule (class, teacher, or room id) */
        readonly value: string,

        /** Array of days in the schedule, might not always be 5! */
        readonly days: BakalariDay[]
    ) {}

    /** Create a new Bakalari schedule from an object of the same structure */
    static fromObject(object: Omit<Bakalari, "date">): Bakalari {
        return new Bakalari(object.type, object.value, object.days);
    }

    /** Get the first day of the week (a Sunday), will be null if the schedule is permanent */
    get date(): Date | null {
        // Get a day from the array (doesn't really matter which one)
        const day = this.days[0];
        if (!day?.date) return null;

        // Get the sunday of the week (the first day of the week)
        const sunday = new Date(day.date);
        sunday.setDate(sunday.getDate() - day.day);

        return sunday;
    }
}

export default Bakalari;
