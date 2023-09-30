import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Parse the teacher's abbreviation from a lesson
 *
 * @param lesson The lesson to get the teacher from
 * @returns The teacher's abbreviation
 */
function parseTeacher(lesson: AnyNode): string | null {
    // Get the teacher's abbreviation from the link and return null if there's none
    const teacher = selectOne("[href*='/teacher/']", lesson);
    if (!teacher) return null;

    // The teacher abbreviation is in the text content of the <em> tag
    return textContent(teacher).trim();
}

export default parseTeacher;
