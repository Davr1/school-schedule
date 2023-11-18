import selectAll, { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { hasChildren, isTag, textContent } from "domutils";

import { type AnyLessonChange, DetailHandler, SSSVT, type SSSVTClass } from "@/classes";
import dom from "@/parser/dom";
import SSSVTLessonParser from "@/parser/sssvt/lesson";

class SSSVTParser {
    private lessonParser: SSSVTLessonParser;

    constructor(details: DetailHandler) {
        this.lessonParser = new SSSVTLessonParser(details);
    }

    /**
     * Parse the data from the school substitution schedule
     *
     * @param html The html to parse
     * @returns A substitution schedule with the parsed data
     */
    async parse(html: string): Promise<SSSVT> {
        // Parse the html into a dom
        const scheduleDom = await dom(html);

        // Get the date of the schedule. If it's invalid, throw an error
        const date = this.date(scheduleDom);
        if (!date || isNaN(date.getTime())) throw new Error("Invalid date");

        // Get all the classes from the table and parse them into an object (skips odd rows and the header)
        const classes = {} as Record<string, SSSVTClass>;
        for (const node of selectAll(".table-responsive tr:nth-child(2n)", scheduleDom)) {
            // For type safety, make sure this node has children and that there's a row after it
            if (!hasChildren(node) || !node.next || !node.firstChild) continue;

            // Get the class name (it's the first cell in the row)
            // and if the name is falsy or "dozor v hodine", skip it
            const name = textContent(node.firstChild);
            if (!name || name === "DH") continue;

            // Get all the lessons (the cells after the first one; we don't have 0th period)
            // also skip ".heightfix" cuz that's just a spacer
            const lessons = selectAll("td:not(:first-of-type, .heightfix)", node);
            const split = selectAll("td:not(.heightfix)", node.next);

            // Loop through all the periods to parse them into an array and add them to the object
            classes[name] = lessons.map((lesson) => this.period(lesson, split));
        }

        // Return the parsed data as a SSSVT class
        return new SSSVT(date, classes);
    }

    /** Parse the date from a substitution schedule page */
    private date(dom: AnyNode[]): Date | undefined {
        // The date can be found in the title of the link to today's schedule,
        // which is the first <a> tag after the <strong> tag that shows the day
        const dateNode = selectOne("#dny strong + a", dom);

        // Parse the "title" attribute as a Date object (it's in the format "YYYY-MM-DD", so it can be parsed as is)
        if (dateNode && isTag(dateNode)) return new Date(dateNode.attribs.title);
    }

    /** Parse data for the given period */
    private period(lessonNode: AnyNode, split: AnyNode[]): AnyLessonChange[] {
        // Get the 1st lesson from the period, and return if there's no lesson (also check if it's a tag for type safety)
        const lesson1 = this.lessonParser.parse(lessonNode);
        if (!lesson1 || !isTag(lessonNode)) return [];

        // Check if there's a 2nd lesson, if not, return just the 1st lesson
        const has2ndLesson = lessonNode.attribs.rowspan === "1";
        if (!has2ndLesson) return [lesson1];

        // Get the node for the 2nd lesson and parse it
        // (it's not gonna be on the same index, so I have to shift the array)
        const lesson2Node = split.shift();
        const lesson2 = lesson2Node && this.lessonParser.parse(lesson2Node);

        // Return both lessons (filter out undefined, in case the 2nd lesson doesn't exist)
        return [lesson1, lesson2].filter(Boolean) as AnyLessonChange[];
    }
}

export default SSSVTParser;
