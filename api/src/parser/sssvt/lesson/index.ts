import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import { LessonCancellation, type LessonChange, LessonSubstitution } from "@/classes/sssvt/change";
import parseGroup from "@/parser/sssvt/lesson/group";
import parseRoom from "@/parser/sssvt/lesson/room";
import parseSubject from "@/parser/sssvt/lesson/subject";
import parseTeacher from "@/parser/sssvt/lesson/teacher";

/**
 * Parse data about a lesson substitution
 *
 * @param lesson The lesson to parse
 */
function parseLesson(lesson: AnyNode): LessonChange | undefined {
    // Check if the lesson has any text inside, if not, return
    if (!textContent(lesson).trim()) return;

    // Get the group number and subject abbreviation
    const group = parseGroup(lesson);
    const subject = parseSubject(lesson);

    // If there's no subject, it means that the lesson is cancelled
    // Note: Only check for null because the value can be an empty string
    if (subject === null) return new LessonCancellation(group);

    // Get the room number and teacher abbreviation
    const room = parseRoom(lesson);
    const teacher = parseTeacher(lesson);

    return new LessonSubstitution(group, subject, room, teacher);
}

export default parseLesson;
