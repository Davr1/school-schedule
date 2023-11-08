import { selectOne } from "css-select";
import type { AnyNode, Element } from "domhandler";
import { textContent } from "domutils";

import { DetailHandler, NormalLesson, SubjectDetails, TeacherDetails } from "@/classes";
import { AbsenceLesson, type Group } from "@/classes/bakalari";
import type { BakalariData } from "@/parser/bakalari/lesson";

class BakalariNormalLessonParser {
    constructor(private details: DetailHandler) {}

    /**
     * Parse a normal lesson from a node
     *
     * @param node The node to parse
     * @param data The data attribute of the node
     * @returns The parsed lesson
     */
    parse(node: Element, data: BakalariData): NormalLesson | AbsenceLesson {
        // Check if this is in reality an absence lesson (the format is different)
        if (data.hasAbsent) {
            const [info, name] = data.absentInfoText.split("|").map((text) => text.trim());
            return new AbsenceLesson(info, name, data.changeinfo);
        }

        // Parse all the fields from the node and data
        const subject = this.subject(node, data);
        const teacher = this.teacher(node, data) ?? null;
        const { room } = data;
        const groups = this.groups(data);
        const topic = this.topic(node, data);
        const change = this.change(node, data);

        return new NormalLesson(subject, teacher, room, groups, topic, change);
    }

    /** Parse the subject name and abbreviation for the given lesson */
    private subject(lesson: AnyNode, data: BakalariData): SubjectDetails {
        // Get the subject abbreviation from the lesson
        const abbreviationNode = selectOne(".middle", lesson)!;
        const abbreviation = textContent(abbreviationNode).trim();

        // Parse the full name from the data
        const { subjecttext } = data;
        const name = subjecttext.match(/^.*?(?= \|)/)?.[0] ?? abbreviation;

        // Find the subject in the details
        const subject = this.details.getDetailByAbbreviation(
            abbreviation,
            () => new SubjectDetails(this.details.getNewId(), name, abbreviation)
        );

        // Patch the name if it's null
        if (subject.name === null) subject.name = name;

        return subject;
    }

    /** Parse the teacher's name and abbreviation from a lesson */
    private teacher(lesson: AnyNode, data: BakalariData): TeacherDetails | undefined {
        // Parse the full name from the data (make sure there's only one value)
        const name = data.teacher?.split(",")[0].trim();
        if (!name) return;

        // Get the abbreviation from the node
        const abbreviationNode = selectOne(".bottom > span", lesson)!;
        const abbreviation = textContent(abbreviationNode).trim();

        // Find the teacher in the details
        const teacher = this.details.getDetailByAbbreviation(
            abbreviation,
            () => new TeacherDetails(this.details.getNewId(), name, abbreviation)
        );

        // Patch the name if it's null
        if (teacher.name === null) teacher.name = name;

        return teacher;
    }

    /** Parse the group number from the data attribute of the lesson */
    private groups(data: BakalariData): Group[] {
        // Parse the group from the data
        const groups = data.group.split(",");

        // Return each group (and filter out values that are both null)
        return groups
            .map((group) => {
                // Match the group number and class name from the text
                const number = group.match(/[0-9](?=\.sk)/)?.[0];
                const className = group.match(/[A-Z][0-9]\.[A-C]/)?.[0];

                // Return the group
                return {
                    number: number ? Number(number) : null,
                    class: className ?? null
                };
            })
            .filter((group) => !(group.number === null && group.class === null));
    }

    /** Parse the topic of the lesson */
    private topic(node: AnyNode, data: BakalariData): string | undefined {
        // Make sure the teacher wrote down the topic and absences first (aka, the "zapsano" class is there)
        const foundNode = selectOne(".zapsano", node);

        // Return the "theme" (topic) from the data
        if (foundNode) return data.theme;
    }

    /** Parse info about a potential change */
    private change(node: Element, data: BakalariData): string | undefined {
        // Check if there is a change (the element has the class "pink")
        const changed = node.attribs.class?.includes("pink");

        // Return the change info
        if (changed) return data.changeinfo;
    }
}

export default BakalariNormalLessonParser;
