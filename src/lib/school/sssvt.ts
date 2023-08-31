import type { ChangedPeriod } from "$lib/school/parser/sssvt/period";

/** All of the classes in the school with their substitutions for the day */
type SSSVTSubstitutions = Record<string, (ChangedPeriod | null)[]>;

/**
 * SSSVT subsitution schedule
 *
 * Note: This only contains info about the subsitutions for a given day
 *
 * You won't be able to get the whole schedule from this. But you can patch the static schedule with this.
 *
 * If you wan't to parse the schedule from HTML, use the static `parse` method from `SSSVTParser` instead.
 */
class SSSVT {
    /** The date of the schedule in the following format: YYYY-MM-DD */
    readonly date: string;

    /** All of the classes in the school with their substitutions for the day */
    readonly classes: SSSVTSubstitutions;

    /**
     * Create a new SSSVT schedule
     *
     * @param date The date of the schedule
     * @param classes The classes with their substitutions
     */
    constructor(date: string, classes: SSSVTSubstitutions) {
        this.date = date;
        this.classes = classes;
    }
}

export default SSSVT;
