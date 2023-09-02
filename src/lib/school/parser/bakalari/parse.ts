import selectAll from "css-select";
import type { AnyNode } from "domhandler";

import type { WeekDay } from "$lib/school/bakalari";
import getDay from "$lib/school/parser/bakalari/day";
import parseLesson from "$lib/school/parser/bakalari/lesson";

/**
 * Parse the timetable from the given DOM
 *
 * @param dom The DOM to parse
 * @param value The schedule value
 * @returns The parsed timetable
 */
function parse(dom: AnyNode[], value: string): Record<WeekDay, any[][]> {
    // Select all the days
    const days = selectAll(".bk-timetable-row", dom);

    // Parse each day
    const parsed = days.map((node, index) => {
        // Get each period in the day
        const periods = selectAll(".bk-timetable-cell", node);

        // Get the day of the week from the day or the index
        let day: WeekDay = getDay(node)?.getDay() ?? index + 1;

        // Return the day and the periods as a tuple
        return [
            // Used for Object.fromEntries later
            day,

            // Parse each period
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
    return data as Record<WeekDay, any[][]>;
}

export default parse;
