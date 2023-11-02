import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import type { Info } from "@/classes/bakalari";
import type { BakalariData } from "@/parser/bakalari/lesson/data";

/**
 * Parse the teacher's name and abbreviation from a lesson
 *
 * @param lesson The lesson to get the teacher's name from
 * @param data The data attribute of the lesson
 * @returns The teacher's name
 */
function parseTeacher(lesson: AnyNode, data: BakalariData): Info | null {
    // Parse the full name from the data (make sure there's only one value)
    const name = data.teacher?.split(",")[0].trim() ?? null;

    // If name is null, the abbreviation will be null too, so just return null here
    if (name === null) return null;

    // Get the abbreviation from the node
    const abbreviationNode = selectOne(".bottom > span", lesson)!;
    const abbreviation = textContent(abbreviationNode).trim();

    return { abbreviation, name };
}

export default parseTeacher;
