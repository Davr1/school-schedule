import type { Group } from "@/classes/bakalari/lesson";
import type { BakalariData } from "@/parser/bakalari/data";

/**
 * Get the group number from the data attribute of the lesson
 *
 * @param data The data attribute of the lesson
 * @returns The group
 */
function getGroups(data: BakalariData): Group[] {
    // Parse the group from the data
    const groups = data.group.split(",");

    // Return each group (and filter out values that are both null)
    return groups
        .map((group) => {
            // Match the group number from the text
            const number = group.match(/[0-9](?=\.sk)/)?.[0];

            // Also try to match the class name from the text (sometimes it ain't included tho)
            const className = group.match(/[A-Z][0-9]\.[A-C]/)?.[0] ?? null;

            // Return the group
            return {
                number: number ? Number(number) : null,
                class: className
            };
        })
        .filter((group) => !(group.number === null && group.class === null));
}

export default getGroups;
