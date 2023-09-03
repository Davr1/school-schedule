import type { Element } from "domhandler";

import { NormalLesson } from "$lib/school/bakalari/lesson";
import getChange from "$lib/school/parser/bakalari/change";
import type { BakalariData } from "$lib/school/parser/bakalari/data";
import getGroups from "$lib/school/parser/bakalari/group";
import getSubject from "$lib/school/parser/bakalari/subject";
import getTeacher from "$lib/school/parser/bakalari/teacher";
import getTopic from "$lib/school/parser/bakalari/topic";

/**
 * Parse a normal lesson from a node
 *
 * @param node The node to parse
 * @param data The data attribute of the node
 * @returns The parsed lesson
 */
function parseNormal(node: Element, data: BakalariData): NormalLesson {
    // I'm not gonna add comments everywhere... just read the names
    const subject = getSubject(node, data);
    const teacher = getTeacher(node, data);
    const { room } = data;
    const groups = getGroups(data);
    const topic = getTopic(node, data);
    const change = getChange(node, data);

    return new NormalLesson(subject, teacher, room, groups, topic, change);
}

export default parseNormal;
