import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import getGroup from "$lib/parser/scrape/group";
import getRoom from "$lib/parser/scrape/room";
import getSubject from "$lib/parser/scrape/subject";
import getTeacher from "$lib/parser/scrape/teacher";

/**
 * Parse data about a lesson substitution
 *
 * @param lesson The lesson to parse
 */
function lesson(lesson: AnyNode) {
    // Check if the lesson has any text inside, if not, return
    if (!textContent(lesson).trim()) return;

    // Get the group this lesson is for
    const group = getGroup(lesson);

    // Get the subject abbreviation
    const subject = getSubject(lesson);

    // If there's no subject, it means that the lesson is cancelled
    // Note: Only check for null because the value can be an empty string
    if (subject === null) return null;

    // Find the room the lesson is in
    const room = getRoom(lesson);

    // Get the teacher abbreviation
    const teacher = getTeacher(lesson);

    return { subject, group, room, teacher };
}

export default lesson;
