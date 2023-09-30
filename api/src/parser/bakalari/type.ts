import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import { BakalariType } from "@/classes/bakalari";

interface ValueAndType {
    /** The value of the schedule (class name, teacher name or room name) */
    value: string;

    /** The type of the schedule (class, teacher or room) */
    type: BakalariType;
}

/**
 * Get the value (and type) of the schedule (class, teacher or room)
 *
 * @param dom The DOM to find the schedule type from
 * @returns The schedule type
 */
function getValue(dom: AnyNode[]): ValueAndType {
    // Get the node that contains the dropdowns
    const selects = selectOne(".bk-timetable-selects", dom)!;

    // Check each dropdown to see if it's the one with a pre-selected value
    const classNode = selectOne("#selectedClass > option[selected]", selects);
    const teacherNode = selectOne("#selectedTeacher > option[selected]", selects);
    const roomNode = selectOne("#selectedRoom > option[selected]", selects);

    // Return the value of the selected option
    if (classNode !== null) return { type: BakalariType.Class, value: textContent(classNode).trim() };
    if (teacherNode) return { type: BakalariType.Teacher, value: textContent(teacherNode).trim() };
    if (roomNode) return { type: BakalariType.Room, value: textContent(roomNode).trim() };

    // Throw an error if none of the dropdowns have a pre-selected value
    throw new Error("Invalid schedule type");
}

export default getValue;
