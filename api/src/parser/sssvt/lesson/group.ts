import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Parse the group number from the given lesson
 *
 * @param lesson The lesson to get the group for
 * @returns The group number
 */
function parseGroup(lesson: AnyNode): number | null {
    // Get the content of the lesson as a string,
    // and parse the group number from it in the format: (N.sk)
    const content = textContent(lesson);
    const match = content.match(/(?<=\()[0-9](?=\.sk\))/)?.[0];

    // If it exists, return it as a number
    if (match) return parseInt(match);

    // Otherwise, return null
    return null;
}

export default parseGroup;
