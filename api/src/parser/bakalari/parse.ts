import selectAll from "css-select";
import type { AnyNode } from "domhandler";

import type { BakalariPeriod } from "@/classes/bakalari/day";
import BakalariDay from "@/classes/bakalari/day";
import getDay from "@/parser/bakalari/day";
import getEvent from "@/parser/bakalari/event";
import parseLesson from "@/parser/bakalari/lesson";

/**
 * Parse the timetable from the given DOM
 *
 * @param dom The DOM to parse
 * @returns The parsed timetable
 */
function parse(dom: AnyNode[]): BakalariDay[] {
    // Select all the day row nodes
    const dayNodes = selectAll(".bk-timetable-row", dom);

    // Parse each day and return the parsed data
    return dayNodes.map((node, index) => {
        // Get the date and the day of the week
        const date = getDay(node);
        const day = date?.getDay() ?? index + 1;

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
            return lessons.map(parseLesson) as unknown as BakalariPeriod;
        });

        // Return the parsed day
        return new BakalariDay(day, date, periods);
    });
}

export default parse;
