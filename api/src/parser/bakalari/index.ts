import { Detail, type DetailHandler, Lesson, Schedule } from "@/classes";
import BakalariLessonParser from "@/parser/bakalari/lesson";
import type { IElement, IParentNode } from "@/parser/interfaces";

class BakalariParser {
    #lessonParser: BakalariLessonParser;

    constructor(details: DetailHandler) {
        this.#lessonParser = new BakalariLessonParser(details);
    }

    /**
     * Parse the timetable from the given html
     *
     * @param detail The detail of the schedule
     * @param html The html to parse
     * @returns The parsed days from the timetable
     */
    parse(detail: Detail, dom: IParentNode): Schedule[] {
        // Parse the html into a dom, and select all the day row nodes
        const dayNodes = Array.from(dom.querySelectorAll(".bk-timetable-row"));

        // Parse each day and return the parsed data
        return dayNodes.map((node, index) => {
            // Get the date and the day of the week
            const date = this.#date(node) ?? index + 1;

            // If there's a full day event, return that instead (there won't be any lessons)
            const event = this.#event(node);
            if (event !== undefined) return new Schedule(detail, date, [], event);

            // Get each period node, and parse it
            const periodNodes = Array.from(node.querySelectorAll(".bk-timetable-cell"));
            const periods = periodNodes.map((node) => {
                // Get all the lessons in the period
                const lessons = Array.from(node.querySelectorAll(".day-item-hover"));

                // Parse each lesson, then wrap the BakalariLesson in a Lesson class
                return lessons.map(this.#lessonParser.parse, this.#lessonParser).map((lesson) => new Lesson(lesson));
            });

            // Return the parsed day
            return new Schedule(detail, date, periods);
        });
    }

    /** Parse the day info from a row */
    #date(node: IElement): Date | undefined {
        const text = node.querySelector(".bk-day-date")?.textContent;

        // Don't return anything if the text is empty (for permanent schedules)
        if (!text) return;

        let [day, month] = text.split("/").map(Number);
        month -= 1; // Months in the text are 1-indexed, but Date uses 0-indexed months

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
        return new Date(Date.UTC(year, month, day));
    }

    /** Parse a full day event from the day row */
    #event(node: IElement): string | undefined {
        // Find the full day event node
        const event = node.querySelector(".empty")?.textContent?.trim();

        return event;
    }
}

export default BakalariParser;
