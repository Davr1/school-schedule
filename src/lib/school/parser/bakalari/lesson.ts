import { type AnyNode, isTag } from "domhandler";

import getData from "$lib/school/parser/bakalari/data";
import getGroup from "$lib/school/parser/bakalari/group";
import getSubject from "$lib/school/parser/bakalari/subject";
import getTeacher from "$lib/school/parser/bakalari/teacher";

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
        case "removed":
        case "absent":
            console.warn("Unimplemnted type", data);
            return null;
        default:
            break;
    }

    // Get the subject name
    const subject = getSubject(node, data);

    // Get the teacher's name
    const teacher = getTeacher(node, data);

    // The room in which the lesson is happening (replace falsy values with null)
    const room = data.room || null;

    // The topic of the lesson (also replace falsy values with null)
    const topic = data.theme || null;

    // The group of the lesson
    const group = getGroup(data);

    return {
        subject,
        teacher,
        room,
        topic,
        group
    };
    // console.log(subject.name, teacher.name, room, topic, group);
}

export default parseLesson;
