import selectAll from "css-select";
import type { AnyNode } from "domhandler";

import type { Day } from "$lib/school/bakalari";
import getDay from "$lib/school/parser/bakalari/day";
import parseLesson from "$lib/school/parser/bakalari/lesson";

/**
 * Parse the timetable from the given DOM
 *
 * @param dom The DOM to parse
 * @returns The parsed timetable
 */
function parse(dom: AnyNode[]): Record<Day, any[][]> {
    // Select all the days
    const days = selectAll(".bk-timetable-row", dom);

    // Parse each day
    const parsed = days.map((node) => {
        // Get each period in the day
        const periods = selectAll(".bk-timetable-cell", node);

        // Get the day of the week
        const day = getDay(node).getDay() as Day;

        // Parse each period and return the day and the periods
        return [
            day,

            periods.map((node) => {
                // Get all the lessons in the period
                const lessons = selectAll(".day-item-hover", node);

                // Parse each lesson
                return lessons.map(parseLesson);
            })
        ] as const;
    });

    // Convert the parsed data into an object
    const data = Object.fromEntries(parsed);

    // Return the parsed data
    return data as Record<Day, any[][]>;
}

export default parse;
