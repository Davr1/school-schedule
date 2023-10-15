import type { Element } from "domhandler";

import type { BakalariLessonType } from "@/classes/bakalari/lesson";

export interface BakalariData {
    type: BakalariLessonType;
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
 * Parse the data attribute of the lesson
 *
 * @param node The node to get the data attribute from
 * @returns The data attribute
 */
function parseData(node: Element) {
    // Get the data attribute
    const data = node.attribs["data-detail"] as string;

    // Parse the data attribute
    return JSON.parse(data) as BakalariData;
}

export default parseData;
