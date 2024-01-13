import {
    AbsenceLesson,
    type AnyBakalariLesson,
    BakalariLessonType,
    Detail,
    DetailHandler,
    DetailType,
    type Group,
    NormalLesson,
    RemovedLesson,
    TeacherDetail
} from "@/classes";
import type { IElement } from "@/parser/interfaces";

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
    #details: DetailHandler;

    constructor(details: DetailHandler) {
        this.#details = details;
    }

    /**
     * Parse the lesson from the given node
     *
     * @param node The node to parse
     * @returns The parsed lesson
     */
    parse(node: IElement): AnyBakalariLesson {
        // Get the data attribute from the node
        const data = JSON.parse(node.getAttribute("data-detail")!) as BakalariData;

        switch (data.type) {
            case BakalariLessonType.Normal:
                return this.#normal(node, data);
            case BakalariLessonType.Removed:
                return this.#removed(data);
            case BakalariLessonType.Absence:
                return this.#absence(data);
            default:
                throw new Error(`Unknown lesson type: ${data.type}`);
        }
    }

    /** Parse a normal lesson from a node */
    #normal(node: IElement, data: BakalariData): NormalLesson | AbsenceLesson {
        // Check if this is in reality an absence lesson (the format is different)
        if (data.hasAbsent) {
            const [info, name] = data.absentInfoText.split("|").map((text) => text.trim());
            return new AbsenceLesson(info, name, data.changeinfo);
        }

        // Parse all the fields from the node and data
        const subject = this.#subject(node, data);
        const teacher = this.#teacher(node, data) ?? null;
        const groups = this.#groups(data);
        const change = this.#change(node, data);

        // Get the room from the handler, or create a new one
        const room = this.#details.getByName(data.room, () => new Detail(DetailType.Room, data.room, data.room));

        return new NormalLesson(subject, teacher, room, groups, data.theme || null, change);
    }

    /** Parse a removed lesson from a node */
    #removed(data: BakalariData): RemovedLesson | AbsenceLesson {
        // If there's absence info, return AbsenceLesson instead
        if (data.absentinfo) return this.#absence(data);

        // Just return the info about the removal...
        return new RemovedLesson(data.removedinfo!);
    }

    /** Parse an absence from a node */
    #absence(data: BakalariData): AbsenceLesson {
        return new AbsenceLesson(data.absentinfo!, data.InfoAbsentName, data.removedinfo || null);
    }

    /** Parse the subject name and abbreviation for the given lesson */
    #subject(lesson: IElement, data: BakalariData): Detail {
        // Get the subject abbreviation from the lesson
        const abbreviation = lesson.querySelector(".middle")?.textContent?.trim();
        if (!abbreviation) throw new Error("Couldn't find the subject abbreviation");

        // Parse the full name from the data
        const name = data.subjecttext.split("|")[0]?.trim() ?? abbreviation;

        // Find the subject detail
        const subject = this.#details.get(abbreviation, () => new Detail(DetailType.Subject, abbreviation, name));

        // Patch the name if it's null
        if (subject.name === null) subject.name = name;

        return subject;
    }

    /** Parse the teacher's name and abbreviation from a lesson */
    #teacher(lesson: IElement, data: BakalariData): TeacherDetail | undefined {
        // Parse the full name from the data (make sure there's only one value)
        const name = data.teacher?.split(",")[0]?.trim();
        if (!name) return;

        // Get the abbreviation from the node
        // const abbreviationNode = selectOne(".bottom > span", lesson)!;
        const abbreviation = lesson.querySelector(".bottom > span")?.textContent?.trim();
        if (!abbreviation) throw new Error("Couldn't find the teacher's abbreviation");

        // Find the teacher detail
        const teacher = this.#details.getByAbbreviation(abbreviation, () => new TeacherDetail(abbreviation, name, abbreviation));

        // Patch the name if it's null
        if (teacher.name === null) teacher.name = name;

        return teacher;
    }

    /** Parse the group number from the data attribute of the lesson */
    #groups(data: BakalariData): Group[] {
        // Parse the group from the data
        const groups = data.group.split(",");

        // Return each group (and filter out values that are both null)
        return groups
            .map((group) => {
                // Match the group number and class name from the text
                const number = group.match(/[0-9](?=\.sk)/)?.[0];
                const className = group.match(/[A-Z][0-9]\.[A-C]/)?.[0];

                // Get the class detail from the details handler, or create a new one
                const classDetails = className
                    ? this.#details.getByName(className, () => new Detail(DetailType.Class, className, className))
                    : null;

                // Return the group
                return {
                    number: number ? Number(number) : null,
                    class: classDetails
                };
            })
            .filter((group) => !(group.number === null && group.class === null));
    }

    /** Parse info about a potential change */
    #change(node: IElement, data: BakalariData): string | undefined {
        // Check if there is a change (the element has the class "pink")
        const changed = node.getAttribute("class")?.includes("pink");

        // Return the change info
        if (changed) return data.changeinfo;
    }
}

export default BakalariLessonParser;
