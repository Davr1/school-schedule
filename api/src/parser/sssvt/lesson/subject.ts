import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Parse the subject abbreviation from a lesson
 *
 * @param lesson The lesson to get the subject is happening in
 * @returns The subject abbreviation
 */
function parseSubject(lesson: AnyNode): string | null {
    // Get the subject abbreviation from the lesson, and return null if there's none
    const subject = selectOne("strong", lesson);
    if (!subject) return null;

    // The subject is in the text content of the <strong> tag
    return textContent(subject).trim();
}

export default parseSubject;
