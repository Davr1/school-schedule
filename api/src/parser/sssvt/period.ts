import { type AnyNode, isTag } from "domhandler";

import type { SchedulePeriod } from "@/classes/schedule";
import type { LessonChange } from "@/classes/sssvt/change";
import parseLesson from "@/parser/sssvt/lesson";

/**
 * Parse data for the given period
 *
 * Note: Here I'm calling period a cell in a row (which can contain 1 or 2 lessons)
 * @param lessonNode The 1st lesson to parse
 * @param split The lessons from the other group
 */
function parsePeriod(lessonNode: AnyNode, split: AnyNode[]): SchedulePeriod<LessonChange> {
    // Get the 1st lesson from the period, and return if there's no lesson (also check if it's a tag for type safety)
    const lesson1 = parseLesson(lessonNode);
    if (!lesson1 || !isTag(lessonNode)) return [];

    // Check if there's a 2nd lesson, if not, return just the 1st lesson
    const has2ndLesson = lessonNode.attribs.rowspan === "1";
    if (!has2ndLesson) return [lesson1] as const;

    // Get the node for the 2nd lesson and parse it
    // (it's not gonna be on the same index, so I have to shift the array)
    const lesson2Node = split.shift();
    const lesson2 = lesson2Node && parseLesson(lesson2Node);

    // If there's no lesson, return
    if (!lesson2) return [lesson1] as const;

    // Return both lessons
    return [lesson1, lesson2] as const;
}

export default parsePeriod;
