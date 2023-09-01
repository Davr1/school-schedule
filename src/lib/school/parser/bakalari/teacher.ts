import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import type { BakalariData } from "$lib/school/parser/bakalari/data";

interface Teacher {
    /** Abbreviation of the teacher's name */
    abbreviation: string;

    /** Full name of the teacher */
    name: string;
}

/**
 * Get the teacher's name from a lesson
 *
 * @param lesson The lesson to get the teacher's name from
 * @param data The data attribute of the lesson
 * @returns The teacher's name
 */
function getTeacher(lesson: AnyNode, data: BakalariData): Teacher {
    // Get the abbreviation from the node
    const abbreviationNode = selectOne(".bottom > span", lesson)!;
    const abbreviation = textContent(abbreviationNode).trim();

    // Parse the full name from the data
    const name = data.teacher;

    return { abbreviation, name };
}

export default getTeacher;
