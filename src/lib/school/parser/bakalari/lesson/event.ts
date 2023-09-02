import type { BakalariData } from "$lib/school/parser/bakalari/data";

/**
 * Parse a event lesson from a node
 *
 * @param data The data attribute of the node
 * @returns The parsed lesson
 */
function parseEvent(data: BakalariData) {
    // Get the fields
    const name = data.InfoAbsentName!;
    const abbreviation = data.absentinfo!;
    const change = data.removedinfo!;

    return { name, abbreviation, change };
}

export default parseEvent;
