import selectAll from "css-select";

import type { BakalariPeriod } from "@/classes/bakalari/day";
import BakalariDay from "@/classes/bakalari/day";
import parseDate from "@/parser/bakalari/date";
import parseEvent from "@/parser/bakalari/event";
import parseLesson from "@/parser/bakalari/lesson";
import dom from "@/parser/dom";

/**
 * Parse the timetable from the given html
 *
 * @param html The html to parse
 * @returns The parsed days from the timetable
 */
async function parseBakalari(html: string): Promise<BakalariDay[]> {
    // Parse the html into a dom, and select all the day row nodes
    const scheduleDom = await dom(html);
    const dayNodes = selectAll(".bk-timetable-row", scheduleDom);

    // Parse each day and return the parsed data
    return dayNodes.map((node, index) => {
        // Get the date and the day of the week
        const date = parseDate(node);
        const day = date?.getDay() ?? index + 1;

        // If there's a full day event, return that instead (there won't be any lessons)
        const event = parseEvent(node);
        if (event !== null) return new BakalariDay(day, date, [], event);

        // Get each period node, and parse it
        const periodNodes = selectAll(".bk-timetable-cell", node);
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

export default parseBakalari;
