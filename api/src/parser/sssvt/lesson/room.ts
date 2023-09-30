import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Parse the room for the given lesson
 *
 * @param lesson The lesson to find the room for
 * @returns The room as string (can't be a number cuz some rooms have letters in them)
 */
function parseRoom(lesson: AnyNode): string {
    // Get the room number from the <a> tag with an href attribute
    const link = selectOne("[href*='/room/']", lesson);

    // If there's no link, throw an error
    if (!link) throw new Error(`Couldn't find the room link in lesson: ${textContent(lesson)}`);

    // The room is in the text content of the link
    return textContent(link).trim();
}

export default parseRoom;
