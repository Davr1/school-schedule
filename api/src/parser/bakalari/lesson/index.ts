import { type AnyNode, isTag } from "domhandler";

import { type Lesson, LessonType } from "@/classes/bakalari/lesson";
import getData from "@/parser/bakalari/data";
import parseAbsence from "@/parser/bakalari/lesson/absence";
import parseNormal from "@/parser/bakalari/lesson/normal";
import parseRemoved from "@/parser/bakalari/lesson/removed";

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
        case LessonType.Normal:
            return parseNormal(node, data);
        case LessonType.Removed:
            return parseRemoved(data);
        case LessonType.Absence:
            return parseAbsence(data);
        default:
            throw new Error(`Unknown lesson type: ${data.type}`);
    }
}

export default parseLesson;
