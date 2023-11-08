import selectAll, { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import { type DetailHandler, Details, Lesson, Schedule, type ScheduleType } from "@/classes";
import BakalariLessonParser from "@/parser/bakalari/lesson";
import dom from "@/parser/dom";

class BakalariParser {
    private lessonParser: BakalariLessonParser;

    constructor(details: DetailHandler) {
        this.lessonParser = new BakalariLessonParser(details);
    }

    /**
     * Parse the timetable from the given html
     *
     * @param html The html to parse
     * @returns The parsed days from the timetable
     */
    async parse(type: ScheduleType, value: Details, html: string): Promise<Schedule[]> {
        // Parse the html into a dom, and select all the day row nodes
        const scheduleDom = await dom(html);
        const dayNodes = selectAll(".bk-timetable-row", scheduleDom);

        // Parse each day and return the parsed data
        return dayNodes.map((node, index) => {
            // Get the date and the day of the week
            const date = this.date(node) ?? index + 1;

            // If there's a full day event, return that instead (there won't be any lessons)
            const event = this.event(node);
            if (event !== undefined) return new Schedule(type, value, date, [], event);

            // Get each period node, and parse it
            const periodNodes = selectAll(".bk-timetable-cell", node);
            const periods = periodNodes.map((node) => {
                // Get all the lessons in the period
                const lessons = selectAll(".day-item-hover", node);

                // Parse each lesson, then wrap the BakalariLesson in a Lesson class
                return lessons.map(this.lessonParser.parse, this.lessonParser).map((lesson) => new Lesson(lesson));
            });

            // Return the parsed day
            return new Schedule(type, value, date, periods);
        });
    }

    /** Parse the day info from a row */
    private date(node: AnyNode): Date | undefined {
        const dayNode = selectOne(".bk-day-date", node);
        const text = dayNode && textContent(dayNode);

        // Don't return anything if the text is empty (for permanent schedules)
        if (!text) return;

        const [day, month] = text.split("/").map(Number);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        let year: number;
        // If the month is December and the current month is january, then the date is from last year
        if (month === 11 && currentMonth === 0) year = currentYear - 1;
        // If the month is January and the current month is December, then the date is from next year
        else if (month === 0 && currentMonth === 11) year = currentYear + 1;
        // Otherwise, the date is from the current year
        else year = currentYear;

        // Parse the date into a Date object
        return new Date(Date.UTC(year, month - 1, day));
    }

    /** Parse a full day event from the day row */
    private event(node: AnyNode): string | undefined {
        // Find the full day event node
        const event = selectOne(".empty", node);

        // Return the full day event text
        if (event) return textContent(event).trim();
    }
}

export default BakalariParser;
