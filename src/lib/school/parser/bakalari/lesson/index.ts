import { type AnyNode, isTag } from "domhandler";

import type { Lesson } from "$lib/school/bakalari/lesson";
import getData from "$lib/school/parser/bakalari/data";
import parseAbsence from "$lib/school/parser/bakalari/lesson/absence";
import parseNormal from "$lib/school/parser/bakalari/lesson/normal";
import parseRemoved from "$lib/school/parser/bakalari/lesson/removed";

/** Use LessonType from the lesson module instead, this is only for parsing */
export const enum InternalLessonType {
    Normal = "atom",
    Removed = "removed",
    Absence = "absent"
}

/**
 * Parse the lesson from the given node
 *
 * @param node The node to parse
 * @returns The parsed lesson
 */
function parseLesson(node: AnyNode): Lesson {
    // Make sure the node is an element
    if (!isTag(node)) throw new Error("Node is not an element");

    // Get the data attribute from the node
    const data = getData(node);

    switch (data.type) {
        case InternalLessonType.Normal:
            return parseNormal(node, data);
        case InternalLessonType.Removed:
            return parseRemoved(data);
        case InternalLessonType.Absence:
            return parseAbsence(data);
        default:
            throw new Error(`Unknown lesson type: ${data.type}`);
    }
}

export default parseLesson;
