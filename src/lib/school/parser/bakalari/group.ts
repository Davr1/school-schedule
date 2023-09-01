import type { BakalariData } from "$lib/school/parser/bakalari/data";

/**
 * Get the group number from the data attribute of the lesson
 *
 * @param data The data attribute of the lesson
 * @returns The group
 */
function getGroup(data: BakalariData): number | null {
    // Parse the group from the data
    const { group } = data;

    // Return null if the group is falsy
    if (!group) return null;

    // Match the group number from the text
    const match = group.match(/[0-9](?=\.sk)/)?.[0];

    // Return the group number
    return match ? parseInt(match) : null;
}

export default getGroup;
