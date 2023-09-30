import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import parseGroup from "@/parser/sssvt/lesson/group";
import parseRoom from "@/parser/sssvt/lesson/room";
import parseSubject from "@/parser/sssvt/lesson/subject";
import parseTeacher from "@/parser/sssvt/lesson/teacher";

export interface CancelledLesson {
    subject: null;
    group: number | null;
}

export interface SubstitutedLesson {
    subject: string;
    group: number | null;
    room: string | null;
    teacher: string | null;
}

export type ChangedLesson = CancelledLesson | SubstitutedLesson;
export type ChangedGroupedLesson = ChangedLesson & { group: number };

/**
 * Parse data about a lesson substitution
 *
 * @param lesson The lesson to parse
 */
function parseLesson(lesson: AnyNode): ChangedLesson | undefined {
    // Check if the lesson has any text inside, if not, return
    if (!textContent(lesson).trim()) return;

    // Get the group number and subject abbreviation
    const group = parseGroup(lesson);
    const subject = parseSubject(lesson);

    // If there's no subject, it means that the lesson is cancelled
    // Note: Only check for null because the value can be an empty string
    if (subject === null) return { subject, group };

    // Get the room number and teacher abbreviation
    const room = parseRoom(lesson);
    const teacher = parseTeacher(lesson);

    return { subject, group, room, teacher };
}

export default parseLesson;
