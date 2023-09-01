import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import type { BakalariData } from "$lib/school/parser/bakalari/data";

interface Subject {
    /** Abbreviation of the subject */
    abbreviation: string;

    /** Full name of the subject */
    name: string;
}

/**
 * Get the subject name for the given lesson
 *
 * @param lesson The lesson to get the subject name from
 * @param data The data attribute of the lesson
 * @returns The subject name
 */
function getSubject(lesson: AnyNode, data: BakalariData): Subject {
    // Get the subject abbreviation from the lesson
    const abbreviationNode = selectOne(".middle", lesson)!;
    const abbreviation = textContent(abbreviationNode).trim();

    // Parse the full name from the data
    const { subjecttext } = data;
    const name = subjecttext.match(/^.*?(?= \|)/)?.[0] ?? abbreviation;

    return { abbreviation, name };
}

export default getSubject;
