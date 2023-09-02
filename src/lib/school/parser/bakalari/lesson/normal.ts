import type { Element } from "domhandler";

import getChange from "$lib/school/parser/bakalari/change";
import type { BakalariData } from "$lib/school/parser/bakalari/data";
import getGroup from "$lib/school/parser/bakalari/group";
import getSubject from "$lib/school/parser/bakalari/subject";
import getTeacher from "$lib/school/parser/bakalari/teacher";

/**
 * Parse a normal lesson from a node
 *
 * @param node The node to parse
 * @param data The data attribute of the node
 * @returns The parsed lesson
 */
function parseNormal(node: Element, data: BakalariData) {
    // Get the subject name
    const subject = getSubject(node, data);

    // Get the teacher's name
    const teacher = getTeacher(node, data);

    // The room in which the lesson is happening
    const room = data.room;

    // The topic of the lesson (replace falsy values with null)
    const topic = data.theme || null;

    // The group of the lesson
    const group = getGroup(data);

    // Change info
    const change = getChange(node, data);

    return {
        subject,
        teacher,
        room,
        topic,
        group,
        change
    };
}

export default parseNormal;
