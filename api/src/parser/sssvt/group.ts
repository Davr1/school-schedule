import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Get the group a lesson is for
 *
 * @param lesson The lesson to get the group for
 * @returns The group...
 */
function getGroup(lesson: AnyNode): number | null {
    // Get the content of the lesson as a string
    const content = textContent(lesson);

    // Parse it to find the group (X.sk)
    const match = content.match(/(?<=\()[0-9](?=\.sk\))/);

    // If it exists, return it as a number
    if (match) return parseInt(match[0]);

    // Otherwise, return null
    return null;
}

export default getGroup;
