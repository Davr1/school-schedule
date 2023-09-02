import type { BakalariData } from "$lib/school/parser/bakalari/data";

interface Group {
    /** The group number, null if the whole class is targetted */
    number: number | null;

    /** The class name, null if the schedule type is class */
    class: string | null;
}

/**
 * Get the group number from the data attribute of the lesson
 *
 * @param data The data attribute of the lesson
 * @returns The group
 */
function getGroup(data: BakalariData): Group {
    // Parse the group from the data
    const { group } = data;

    // Match the group number from the text
    const number = group.match(/[0-9](?=\.sk)/)?.[0] ?? null;

    // Also try to match the class name from the text (sometimes it ain't included tho)
    const className = group.match(/[A-Z][0-9]\.[A-C]/)?.[0] ?? null;

    // Return the group
    return {
        number: number ? Number(number) : null,
        class: className
    };
}

export default getGroup;
