import selectAll from "css-select";
import { hasChildren, textContent } from "domutils";

import SSSVT, { type Class } from "@/classes/sssvt";
import dom from "@/parser/dom";
import parseDate from "@/parser/sssvt/date";
import parsePeriod from "@/parser/sssvt/period";

/**
 * Parse the data from the school substitution schedule
 *
 * @param html The html to parse
 * @returns A substitution schedule with the parsed data
 */
async function parseSSSVT(html: string): Promise<SSSVT> {
    // Parse the html into a dom
    const scheduleDom = await dom(html);

    // Get the date of the schedule
    const date = parseDate(scheduleDom);

    // Get all the classes from the table and parse them into an object (skips odd rows and the header)
    const classes = {} as Record<string, Class>;
    for (const node of selectAll(".table-responsive tr:nth-child(2n)", scheduleDom)) {
        // For type safety, make sure this node has children and that there's a row after it
        if (!hasChildren(node) || !node.next) continue;

        // Get the class name (it's the first cell in the row)
        // and if the name is falsy or "dozor v hodine", skip it
        const name = node.firstChild && textContent(node.firstChild);
        if (!name || name === "DH") continue;

        // Get all the lessons (the cells after the first one [we don't have 0th period])
        // also skip ".heightfix" cuz that's just a spacer
        const lessons = selectAll("td:not(:first-of-type, .heightfix)", node);
        const split = selectAll("td:not(.heightfix)", node.next);

        // Loop through all the periods to parse them into an array and add them to the object
        classes[name] = lessons.map((lesson) => parsePeriod(lesson, split));
    }

    // Return the parsed data as a SSSVT class
    return new SSSVT(date, classes);
}

export default parseSSSVT;
