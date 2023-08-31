import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Get the teacher's abbreviation from a lesson
 *
 * @param lesson The lesson to get the teacher from
 * @returns The teacher's abbreviation
 */
function getTeacher(lesson: AnyNode): string | null {
    // Get the teacher's abbreviation from the link
    const teacher = selectOne("[href*='/teacher/']", lesson);

    // Return if there's no teacher
    if (!teacher) return null;

    // The teacher abbreviation is in the text content of the <em> tag
    return textContent(teacher).trim();
}

export default getTeacher;
