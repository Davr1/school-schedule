import type { SchedulePeriod } from "@/classes/schedule";
import type { LessonChange } from "@/classes/sssvt/change";

export type SSSVTClass = SchedulePeriod<LessonChange>[];

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
        readonly classes: Record<string, SSSVTClass>
    ) {}

    /** Create a new substitution schedule from an object of the same structure */
    static fromObject(object: SSSVT): SSSVT {
        return new SSSVT(object.date, object.classes);
    }
}

export default SSSVT;
