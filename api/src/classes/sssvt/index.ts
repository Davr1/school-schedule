import type { LessonChange } from "@/classes/sssvt/change";

export type Period = readonly [] | readonly [LessonChange] | readonly [LessonChange, LessonChange];
export type Class = Period[];

/**
 * SSSVT substitution schedule
 *
 * Note: This only contains info about the substitutions for a given day
 */
class SSSVT {
    constructor(
        /** The date of the schedule */
        readonly date: Date,

        /** All the classes in the school with their substitutions for the day */
        readonly classes: Record<string, Class>
    ) {}

    /** Create a new substitution schedule from an object of the same structure */
    static fromObject(object: SSSVT): SSSVT {
        return new SSSVT(object.date, object.classes);
    }
}

export default SSSVT;
