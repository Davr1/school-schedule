import { RemovedLesson } from "@/classes/bakalari/lesson";
import type { BakalariData } from "@/parser/bakalari/lesson/data";

/**
 * Parse a removed lesson from a node
 *
 * @param data The data attribute of the node
 * @returns The parsed lesson
 */
function parseRemoved(data: BakalariData): RemovedLesson {
    // Just return the info about the removal...
    return new RemovedLesson(data.removedinfo!);
}

export default parseRemoved;
