import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Find in which room a lesson is
 *
 * @param lesson The lesson to find the room for
 * @returns The room string (can't be a number cuz some rooms have letters in them)
 */
function getRoom(lesson: AnyNode): string | null {
    // The lesson number is conveniently in an <a> tag
    const link = selectOne("[href*='/room/']", lesson);

    // If there's no link, return null
    if (!link) return null;

    // The room is in the text content of the link
    return textContent(link).trim();
}

export default getRoom;
