import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";

import type { BakalariData } from "@/parser/bakalari/lesson/data";

/**
 * Parse the topic of the lesson
 *
 * @param node The lesson node to parse
 * @param data Data of the lesson
 * @returns The topic or null if the teacher didn't write one down
 */
function parseTopic(node: AnyNode, data: BakalariData): string | null {
    // Make sure the teacher wrote down the topic and absences first (aka, the "zapsano" class is there)
    const foundNode = selectOne(".zapsano", node);

    // If not return null
    if (foundNode === null) return null;

    // Return the "theme" (topic) from the data
    return data.theme;
}

export default parseTopic;
