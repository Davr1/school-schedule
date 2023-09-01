import selectAll from "css-select";
import type { AnyNode } from "domhandler";

import type { Day } from "$lib/school/bakalari";
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

    // Create the object to store the parsed data
    const data: Partial<Record<Day, any[][]>> = {};

    // Parse each day
    days.map((node) => {
        // Get each period in the day
        const periods = selectAll(".bk-timetable-cell", node);

        // Parse each period
        return periods.map((node) => {
            // Get all the lessons in the period
            const lessons = selectAll(".day-item-hover", node);

            // Parse each lesson
            return lessons.map(parseLesson);
        });
    }).forEach((day, i: Day) => {
        // Set the day in the object
        data[i] = day;
    });

    // Return the parsed data
    return data as Record<Day, any[][]>;
}

export default parse;
