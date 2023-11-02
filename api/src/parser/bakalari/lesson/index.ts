import { type AnyNode, isTag } from "domhandler";

import { type BakalariLesson, BakalariLessonType } from "@/classes/bakalari";
import parseAbsence from "@/parser/bakalari/lesson/absence";
import parseData from "@/parser/bakalari/lesson/data";
import parseNormal from "@/parser/bakalari/lesson/normal";
import parseRemoved from "@/parser/bakalari/lesson/removed";

/**
 * Parse the lesson from the given node
 *
 * @param node The node to parse
 * @returns The parsed lesson
 */
function parseLesson(node: AnyNode): BakalariLesson {
    // Make sure the node is an element
    if (!isTag(node)) throw new Error("Node is not an element");

    // Get the data attribute from the node
    const data = parseData(node);

    switch (data.type) {
        case BakalariLessonType.Normal:
            return parseNormal(node, data);
        case BakalariLessonType.Removed:
            return parseRemoved(data);
        case BakalariLessonType.Absence:
            return parseAbsence(data);
        default:
            throw new Error(`Unknown lesson type: ${data.type}`);
    }
}

export default parseLesson;
