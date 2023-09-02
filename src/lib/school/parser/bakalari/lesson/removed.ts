import type { BakalariData } from "$lib/school/parser/bakalari/data";

/**
 * Parse a removed lesson from a node
 *
 * @param data The data attribute of the node
 * @returns The parsed lesson
 */
function parseRemoved(data: BakalariData) {
    // Just return the info about the removal...
    return {
        change: data.removedinfo! // ! for types....
    };
}

export default parseRemoved;
