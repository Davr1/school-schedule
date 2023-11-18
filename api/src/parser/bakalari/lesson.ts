import { selectOne } from "css-select";
import { type AnyNode, type Element, isTag } from "domhandler";
import { textContent } from "domutils";

import {
    AbsenceLesson,
    type AnyBakalariLesson,
    BakalariLessonType,
    DetailHandler,
    Details,
    DetailsType,
    type Group,
    NormalLesson,
    RemovedLesson,
    TeacherDetails
} from "@/classes";

interface BakalariData {
    type: BakalariLessonType;
    subjecttext: string;
    teacher: string | null;
    room: string;
    group: string;
    theme: string;
    notice: string;
    changeinfo: string;
    homeworks: unknown;
    absencetext: unknown;
    hasAbsent: boolean;
    absentinfo: string | null;
    absentInfoText: string;
    removedinfo: string | null;
    InfoAbsentName: string | null;
}

class BakalariLessonParser {
    constructor(private details: DetailHandler) {}

    /**
     * Parse the lesson from the given node
     *
     * @param node The node to parse
     * @returns The parsed lesson
     */
    parse(node: AnyNode): AnyBakalariLesson {
        // Make sure the node is an element
        if (!isTag(node)) throw new Error("Node is not an element");

        // Get the data attribute from the node
        const data = JSON.parse(node.attribs["data-detail"]) as BakalariData;

        switch (data.type) {
            case BakalariLessonType.Normal:
                return this.normal(node, data);
            case BakalariLessonType.Removed:
                return this.removed(data);
            case BakalariLessonType.Absence:
                return this.absence(data);
            default:
                throw new Error(`Unknown lesson type: ${data.type}`);
        }
    }

    /** Parse a normal lesson from a node */
    private normal(node: Element, data: BakalariData): NormalLesson | AbsenceLesson {
        // Check if this is in reality an absence lesson (the format is different)
        if (data.hasAbsent) {
            const [info, name] = data.absentInfoText.split("|").map((text) => text.trim());
            return new AbsenceLesson(info, name, data.changeinfo);
        }

        // Parse all the fields from the node and data
        const subject = this.subject(node, data);
        const teacher = this.teacher(node, data) ?? null;
        const groups = this.groups(data);
        const change = this.change(node, data);

        return new NormalLesson(subject, teacher, data.room, groups, data.theme || null, change);
    }

    /** Parse a removed lesson from a node */
    private removed(data: BakalariData): RemovedLesson | AbsenceLesson {
        // If there's absence info, return AbsenceLesson instead
        if (data.absentinfo) return this.absence(data);

        // Just return the info about the removal...
        return new RemovedLesson(data.removedinfo!);
    }

    /** Parse an absence from a node */
    private absence(data: BakalariData): AbsenceLesson {
        return new AbsenceLesson(data.absentinfo!, data.InfoAbsentName, data.removedinfo || null);
    }

    /** Parse the subject name and abbreviation for the given lesson */
    private subject(lesson: AnyNode, data: BakalariData): Details {
        // Get the subject abbreviation from the lesson
        const abbreviationNode = selectOne(".middle", lesson)!;
        const abbreviation = textContent(abbreviationNode).trim();

        // Parse the full name from the data
        const name = data.subjecttext.split("|")[0]?.trim() ?? abbreviation;

        // Find the subject in the details
        const subject = this.details.getDetail(abbreviation, () => new Details(DetailsType.Subject, abbreviation, name));

        // Patch the name if it's null
        if (subject.name === null) subject.name = name;

        return subject;
    }

    /** Parse the teacher's name and abbreviation from a lesson */
    private teacher(lesson: AnyNode, data: BakalariData): TeacherDetails | undefined {
        // Parse the full name from the data (make sure there's only one value)
        const name = data.teacher?.split(",")[0]?.trim();
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

    /** Parse info about a potential change */
    private change(node: Element, data: BakalariData): string | undefined {
        // Check if there is a change (the element has the class "pink")
        const changed = node.attribs.class?.includes("pink");

        // Return the change info
        if (changed) return data.changeinfo;
    }
}

export default BakalariLessonParser;
