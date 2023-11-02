import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import type { Info } from "@/classes/bakalari";
import type { BakalariData } from "@/parser/bakalari/lesson/data";

/**
 * Parse the subject name and abbreviation for the given lesson
 *
 * @param lesson The lesson to get the subject name from
 * @param data The data attribute of the lesson
 * @returns The subject name
 */
function parseSubject(lesson: AnyNode, data: BakalariData): Info {
    // Get the subject abbreviation from the lesson
    const abbreviationNode = selectOne(".middle", lesson)!;
    const abbreviation = textContent(abbreviationNode).trim();

    // Parse the full name from the data
    const { subjecttext } = data;
    const name = subjecttext.match(/^.*?(?= \|)/)?.[0] ?? abbreviation;

    return { abbreviation, name };
}

export default parseSubject;
