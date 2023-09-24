import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import type { BakalariData } from "@/parser/bakalari/data";

interface Teacher {
    /** Abbreviation of the teacher's name */
    abbreviation: string | null;

    /** Full name of the teacher */
    name: string | null;
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
    const abbreviation = textContent(abbreviationNode).trim() || null;

    // Parse the full name from the data (make sure there's only one value)
    const name = data.teacher?.split(",")[0].trim() ?? null;

    return { abbreviation, name };
}

export default getTeacher;
