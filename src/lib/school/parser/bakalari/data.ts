import type { Element } from "domhandler";

import type { InternalLessonType } from "$lib/school/parser/bakalari/lesson";

export interface BakalariData {
    type: InternalLessonType;
    subjecttext: string;
    teacher: string | null;
    room: string;
    group: string;
    theme: string;
    notice: string;
    changeinfo: string;
    homeworks: unknown;
    absencetext: unknown;
    hasAbsent: boolean;
    absentinfo: string | null;
    absentInfoText: string;
    removedinfo: string | null;
    InfoAbsentName: string | null;
}

/**
 * Get the data attribute of the lesson
 *
 * @param node The node to get the data attribute from
 * @returns The data attribute
 */
function getData(node: Element) {
    // Get the data attribute
    const data = node.attribs["data-detail"] as string;

    // Parse the data attribute
    return JSON.parse(data) as BakalariData;
}

export default getData;
