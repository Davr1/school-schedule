import type { DetailHandler } from "@/classes/details";
import { type AnyLessonChange, LessonChange } from "@/classes/sssvt/change";
import type { SSSVTJSON } from "@/schemas";

/** A class in the SSSVT schedule. Each class has a list of lessons for each period */
export type SSSVTClass = AnyLessonChange[][];

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

    /** Deserialize the schedule from JSON */
    static fromJSON(json: SSSVTJSON, handler: DetailHandler): SSSVT {
        const date = new Date(json.date);
        const classes = Object.fromEntries(
            Object.entries(json.classes).map(([name, cl]) => [
                name,
                cl.map((period) => period.map((lesson) => LessonChange.fromJSON(lesson, handler)))
            ])
        );

        return new SSSVT(date, classes);
    }
}

export default SSSVT;
