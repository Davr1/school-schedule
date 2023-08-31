import selectAll from "css-select";
import { type AnyNode, hasChildren } from "domhandler";
import { textContent } from "domutils";

import period from "$lib/school/parser/sssvt/period";

/**
 * Parse lesson substitutions for the given row (class)
 *
 * @param row The row to parse
 */
function schoolClass(row: AnyNode) {
    // For type safery, make sure this node has children and that there's a row after it
    if (!hasChildren(row) || !row.next) return;

    // Get the class name (it's the first cell in the row)
    const name = row.firstChild && textContent(row.firstChild);

    // Don't continue if the name is falsy or "DH" (cuz idk what that is)
    if (!name || name === "DH") return;

    // Get all of the lessons (the cells after the first one [we don't have 0th period])
    // also skip ".heightfix" cuz that's just a spacer
    const lessons = selectAll("td:not(:first-child, .heightfix)", row);

    // Also try to get lessons from the next row (for the other group [if there is one])
    const split = selectAll("td:not(.heightfix)", row.next);

    // Loop through all the periods and parse them
    return { name, substitutions: lessons.map((node) => period(node, split)) };
}

export default schoolClass;
