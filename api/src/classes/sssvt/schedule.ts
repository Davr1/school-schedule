import type { Detail, DetailHandler } from "@/classes/details";
import { type AnySSSVTChange, BaseSSSVTChange, SSSVTSubstitution } from "@/classes/sssvt/change";
import type { SSSVTJSON } from "@/schemas";

/** A class in the SSSVT schedule. Each class has a list of lessons for each period */
export type SSSVTClass = AnySSSVTChange[][];

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
                cl.map((period) => period.map((lesson) => BaseSSSVTChange.fromJSON(lesson, handler)))
            ])
        );

        return new SSSVT(date, classes);
    }

    /**
     * Extract all details from the schedule
     *
     * @param predicate Predicate to filter the details
     * @param thisArg The value to use as `this` when executing the predicate
     */
    extractDetails(predicate?: (detail: Detail) => boolean, thisArg?: any): Set<Detail> {
        const details = new Set<Detail>();

        function add(detail: Detail) {
            if (predicate && !predicate.call(thisArg, detail)) return;
            details.add(detail);
        }

        for (const schedule of Object.values(this.classes))
            for (const period of schedule)
                for (const lesson of period) {
                    if (!(lesson instanceof SSSVTSubstitution)) continue;
                    const { subject, teacher, room } = lesson;

                    if (subject) add(subject);
                    if (teacher) add(teacher);
                    if (room) add(room);
                }

        return details;
    }
}

export default SSSVT;
