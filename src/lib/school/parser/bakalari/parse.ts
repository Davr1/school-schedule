import selectAll from "css-select";
import type { AnyNode } from "domhandler";

import type { Period, SchoolDay } from "$lib/school/bakalari/day";
import BakalariDay from "$lib/school/bakalari/day";
import getDay from "$lib/school/parser/bakalari/day";
import getEvent from "$lib/school/parser/bakalari/event";
import parseLesson from "$lib/school/parser/bakalari/lesson";

/**
 * Parse the timetable from the given DOM
 *
 * @param dom The DOM to parse
 * @returns The parsed timetable
 */
function parse(dom: AnyNode[]): Record<SchoolDay, BakalariDay> {
    // Select all the day row nodes
    const dayNodes = selectAll(".bk-timetable-row", dom);

    // Parse each day
    const parsed = dayNodes
        .map((node, index) => {
            // Get the date and the day of the week
            const date = getDay(node);
            const day: SchoolDay = date?.getDay() ?? index + 1;

            // Check if there's a full day event
            const event = getEvent(node);

            // If there is, then return the event
            if (event !== null) return new BakalariDay(day, date, [], event);

            // Get each period node
            const periodNodes = selectAll(".bk-timetable-cell", node);

            // Parse each period
            const periods = periodNodes.map((node) => {
                // Get all the lessons in the period
                const lessons = selectAll(".day-item-hover", node);

                // Parse each lesson (and cast to Period)
                return lessons.map(parseLesson) as unknown as Period;
            });

            // Return the parsed day
            return new BakalariDay(day, date, periods);
        })

        // Map the days to an array of [day, day] pairs so it can be converted into an object
        .map((day) => [day.day, day] as const);

    // Convert the parsed data into an object
    const data = Object.fromEntries(parsed);

    // Return the parsed data
    return data as Record<SchoolDay, BakalariDay>;
}

export default parse;
