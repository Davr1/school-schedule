import type BakalariDay from "@/classes/bakalari/day";
import type { SchoolDay } from "@/classes/bakalari/day";

/** Type of the schedule */
export const enum BakalariScheduleType {
    Class = "class",
    Teacher = "teacher",
    Room = "room"
}

/**
 * Bakalari schedule
 *
 * If you want to parse the schedule from HTML, use the `parseBakalari` function from `@/parser/bakalari`
 */
class Bakalari {
    /** Type of the schedule (Class, Teacher, Room) */
    readonly type: BakalariScheduleType;

    /** Value of the schedule (Class name, teacher's name or room number) */
    readonly value: string;

    /** Map of the days of the week to the lessons for that day */
    readonly days: Record<SchoolDay, BakalariDay>;

    /** Create a new Bakalari schedule */
    constructor(type: BakalariScheduleType, value: string, days: Record<SchoolDay, BakalariDay>) {
        this.type = type;
        this.value = value;
        this.days = days;
    }
}

export default Bakalari;
