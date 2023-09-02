import { type AnyNode, isTag } from "domhandler";

import getData from "$lib/school/parser/bakalari/data";
import parseEvent from "$lib/school/parser/bakalari/lesson/event";
import parseNormal from "$lib/school/parser/bakalari/lesson/normal";
import parseRemoved from "$lib/school/parser/bakalari/lesson/removed";

export const enum LessonType {
    /** Normal lesson */
    Normal = "atom",

    /** Canceled */
    Removed = "removed",

    /** Event (not a full day event tho) */
    Event = "absent"
}

/**
 * Parse the lesson from the given node
 *
 * @param node The node to parse
 * @returns The parsed lesson
 */
function parseLesson(node: AnyNode) {
    // Make sure the node is an element
    if (!isTag(node)) return null;

    // Get the data attribute from the node
    const data = getData(node);

    switch (data.type) {
        case LessonType.Normal:
            return parseNormal(node, data);
        case LessonType.Removed:
            return parseRemoved(data);
        case LessonType.Event:
            return parseEvent(data);
        default:
            throw new Error(`Unknown lesson type: ${data.type}`);
    }
}

export default parseLesson;
