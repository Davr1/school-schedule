import type { Element } from "domhandler";

import { NormalLesson } from "@/classes/bakalari/lesson";
import type { BakalariData } from "@/parser/bakalari/lesson/data";
import parseChange from "@/parser/bakalari/lesson/normal/change";
import parseGroups from "@/parser/bakalari/lesson/normal/group";
import parseSubject from "@/parser/bakalari/lesson/normal/subject";
import parseTeacher from "@/parser/bakalari/lesson/normal/teacher";
import parseTopic from "@/parser/bakalari/lesson/normal/topic";

/**
 * Parse a normal lesson from a node
 *
 * @param node The node to parse
 * @param data The data attribute of the node
 * @returns The parsed lesson
 */
function parseNormal(node: Element, data: BakalariData): NormalLesson {
    // Parse all the fields from the node and data
    const subject = parseSubject(node, data);
    const teacher = parseTeacher(node, data);
    const { room } = data;
    const groups = parseGroups(data);
    const topic = parseTopic(node, data);
    const change = parseChange(node, data);

    return new NormalLesson(subject, teacher, room, groups, topic, change);
}

export default parseNormal;
