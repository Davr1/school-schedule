import type { Element } from "domhandler";

import { NormalLesson } from "@/classes/bakalari/lesson";
import getChange from "@/parser/bakalari/change";
import type { BakalariData } from "@/parser/bakalari/data";
import getGroups from "@/parser/bakalari/group";
import getSubject from "@/parser/bakalari/subject";
import getTeacher from "@/parser/bakalari/teacher";
import getTopic from "@/parser/bakalari/topic";

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

    return new NormalLesson({ subject, teacher, room, groups, topic, change });
}

export default parseNormal;
