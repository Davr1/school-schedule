import { type AnyLessonChange, DetailHandler, SSSVT, type SSSVTClass } from "@/classes";
import type { IElement, IParentNode } from "@/parser/interfaces";
import SSSVTLessonParser from "@/parser/sssvt/lesson";

class SSSVTParser {
    #lessonParser: SSSVTLessonParser;

    constructor(details: DetailHandler) {
        this.#lessonParser = new SSSVTLessonParser(details);
    }

    /**
     * Parse the data from the school substitution schedule
     *
     * @param dom The dom to parse
     * @returns A substitution schedule with the parsed data
     */
    parse(dom: IParentNode): SSSVT {
        // Get the date of the schedule. If it's invalid, throw an error
        const date = this.#date(dom);
        if (!date || isNaN(date.getTime())) throw new Error("Invalid date");

        // Get all the classes from the table and parse them into an object (skips odd rows and the header)
        const classes = {} as Record<string, SSSVTClass>;

        const nodes = Array.from(dom.querySelectorAll(".table-responsive tr:nth-child(2n)"));
        for (const node of nodes) {
            // For type safety, make sure this node has children and that there's a row after it
            if (!node.nextSibling || !node.firstChild) continue;

            // Get the class name (it's the first cell in the row)
            // and if the name is falsy or "dozor v hodine", skip it
            const name = node.firstChild.textContent;
            if (!name || name === "DH") continue;

            // Get all the lessons (the cells after the first one; we don't have 0th period)
            // also skip ".heightfix" cuz that's just a spacer
            const lessons = node.querySelectorAll("td:not(:first-of-type, .heightfix)");
            const split = Array.from(node.nextElementSibling?.querySelectorAll("td:not(.heightfix)") ?? []);

            // Loop through all the periods to parse them into an array and add them to the object
            classes[name] = Array.from(lessons).map((lesson) => this.#period(lesson, split));
        }

        // Return the parsed data as a SSSVT class
        return new SSSVT(date, classes);
    }

    /** Parse the date from a substitution schedule page */
    #date(dom: IParentNode): Date | undefined {
        const date = dom.querySelector("#dny strong")?.textContent?.trim();
        if (!date) return;

        // Parse the date from the text (it's in czech format)
        const czechDate = date.split(" ")[1];
        const [day, month, year] = czechDate.split(".").map(Number);

        return new Date(Date.UTC(year, month - 1, day));
    }

    /** Parse data for the given period */
    #period(lessonNode: IElement, split: IElement[]): AnyLessonChange[] {
        // Get the 1st lesson from the period, and return if there's no lesson
        const lesson1 = this.#lessonParser.parse(lessonNode);
        if (!lesson1) return [];

        // Check if there's a 2nd lesson, if not, return just the 1st lesson
        const has2ndLesson = lessonNode.getAttribute("rowspan") === "1";
        if (!has2ndLesson) return [lesson1];

        // Get the node for the 2nd lesson and parse it
        // (it's not gonna be on the same index, so I have to shift the array)
        const lesson2Node = split.shift();
        const lesson2 = lesson2Node && this.#lessonParser.parse(lesson2Node);

        // Return both lessons (filter out undefined, in case the 2nd lesson doesn't exist)
        return [lesson1, lesson2].filter(Boolean) as AnyLessonChange[];
    }
}

export default SSSVTParser;
