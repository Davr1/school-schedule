import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import getGroup from "$lib/school/parser/sssvt/group";
import getRoom from "$lib/school/parser/sssvt/room";
import getSubject from "$lib/school/parser/sssvt/subject";
import getTeacher from "$lib/school/parser/sssvt/teacher";

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
function lesson(lesson: AnyNode): ChangedLesson | undefined {
    // Check if the lesson has any text inside, if not, return
    if (!textContent(lesson).trim()) return;

    // Get the group this lesson is for
    const group = getGroup(lesson);

    // Get the subject abbreviation
    const subject = getSubject(lesson);

    // If there's no subject, it means that the lesson is cancelled
    // Note: Only check for null because the value can be an empty string
    if (subject === null) return { subject, group };

    // Find the room the lesson is in
    const room = getRoom(lesson);

    // Get the teacher abbreviation
    const teacher = getTeacher(lesson);

    return { subject, group, room, teacher };
}

export default lesson;
