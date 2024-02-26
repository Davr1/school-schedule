import type { Detail, DetailHandler } from "@/classes/details";
import { type AnySSSVTChange, BaseSSSVTChange, SSSVTSubstitution } from "@/classes/sssvt/change";
import type { SSSVTBSON } from "@/db";
import type { SSSVTJSON } from "@/schemas";

/** A class in the SSSVT schedule. Each class has a list of lessons for each period */
export type SSSVTClass = AnySSSVTChange[][];

/**
 * SSSVT substitution schedule
 *
 * Note: This only contains info about the substitutions for a given day
 */
class SSSVT {
    /** @private Fetch date */
    fetchDate: Date | undefined;

    constructor(
        /** The date of the schedule */
        readonly date: Date,

        /** All the classes in the school with their substitutions for the day */
        readonly classes: Record<string, SSSVTClass>
    ) {}

    static fromJSON(json: SSSVTJSON | SSSVTBSON, handler: DetailHandler): SSSVT {
        const date = new Date(json.date);
        const classes = Object.fromEntries(
            Object.entries(json.classes).map(([name, cl]) => [
                name,
                cl.map((period) => period.map((lesson) => BaseSSSVTChange.fromJSON(lesson, handler)))
            ])
        );

        return new SSSVT(date, classes);
    }

    extractDetails(predicate?: (detail: Detail) => boolean, thisArg?: any): Set<Detail> {
        return SSSVT.extractDetails([this], predicate, thisArg);
    }

    /**
     * Extract all details from schedules
     *
     * @param schedules The schedules to extract the details from
     * @param predicate Predicate to filter the details
     * @param thisArg The value to use as `this` when executing the predicate
     */
    static extractDetails(schedules: SSSVT[], predicate?: (detail: Detail) => boolean, thisArg?: any): Set<Detail> {
        const details = new Set<Detail>();

        function add(detail: Detail) {
            if (predicate && !predicate.call(thisArg, detail)) return;
            details.add(detail);
        }

        for (const sssvt of schedules)
            for (const schedule of Object.values(sssvt.classes))
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
