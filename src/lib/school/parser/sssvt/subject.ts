import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Get the subject abbreviation from a lesson
 *
 * @param lesson The lesson to get the subject is happening in
 * @returns The subject abbreviation
 */
function getSubject(lesson: AnyNode): string | null {
    // Get the subject abbreviation from the lesson
    const subject = selectOne("strong", lesson);

    // Return if there's no subject
    if (!subject) return null;

    // The subject is in the text content of the <strong> tag
    return textContent(subject).trim();
}

export default getSubject;
