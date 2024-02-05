import {
    AbsenceBakalariLesson,
    type AnyBakalariLesson,
    BakalariLessonType,
    type ClassDetail,
    Detail,
    DetailHandler,
    DetailType,
    Group,
    NormalBakalariLesson,
    RemovedBakalariLesson,
    type TeacherDetail
} from "@/classes";
import type { BakalariAbsenceType } from "@/classes/bakalari/lesson";
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
    homeworks: string[] | null;
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
    #normal(node: IElement, data: BakalariData): NormalBakalariLesson | AbsenceBakalariLesson {
        // Check if this is in reality an absence lesson (the format is different)
        if (data.hasAbsent) {
            const [info, name] = data.absentInfoText.split("|").map((text) => text.trim());
            return new AbsenceBakalariLesson(info, name, data.changeinfo);
        }

        // Parse all the fields from the node and data
        return new NormalBakalariLesson(
            this.#subject(node, data),
            this.#teacher(node, data),
            this.#room(data),
            this.#groups(data),
            data.theme || null,
            this.#absenceType(node),
            this.#homework(data),
            this.#change(node, data)
        );
    }

    /** Parse a removed lesson from a node */
    #removed(data: BakalariData): RemovedBakalariLesson | AbsenceBakalariLesson {
        // If there's absence info, return AbsenceLesson instead
        if (data.absentinfo) return this.#absence(data);

        // Just return the info about the removal...
        return new RemovedBakalariLesson(data.removedinfo!);
    }

    /** Parse an absence from a node */
    #absence(data: BakalariData): AbsenceBakalariLesson {
        return new AbsenceBakalariLesson(data.absentinfo!, data.InfoAbsentName, data.removedinfo || null);
    }

    /** Parse the subject name and abbreviation for the given lesson */
    #subject(lesson: IElement, data: BakalariData): Detail | null {
        // Get the subject abbreviation from the lesson
        const abbreviation = lesson.querySelector(".middle")?.textContent?.trim();
        if (!abbreviation) throw new Error("Couldn't find the subject abbreviation");

        // If the abbreviation of the subject is equal to "....", return `null`.
        // This is usually just some random event without a name
        if (abbreviation === "....") return null;

        // Parse the full name from the data
        const name = data.subjecttext.split("|")[0]?.trim() ?? abbreviation;

        // Find the subject detail, or create a new one
        const subject = this.#details.get(abbreviation) ?? this.#details.add(new Detail(DetailType.Subject, abbreviation, name));

        // Patch the name if it's null
        if (subject.name === null) subject.name = name;

        return subject;
    }

    /** Parse the teacher's name and abbreviation from a lesson */
    #teacher(lesson: IElement, data: BakalariData): TeacherDetail | null {
        // Parse the full name from the data (make sure there's only one value)
        const name = data.teacher?.split(",")[0]?.trim();
        if (!name) return null;

        // Get the abbreviation from the node
        const abbreviation = lesson.querySelector(".bottom")?.textContent?.trim();

        // Try and lookup by full name, if the abbreviation is missing (abbreviations are more reliable)
        if (!abbreviation) return this.#details.getOneByMatch<TeacherDetail>(name);

        // Find the teacher detail, throw an error if not found
        return this.#details.getOneByAbbreviation<TeacherDetail>(abbreviation);
    }

    /** Parse the room from the data attribute of the lesson */
    #room(data: BakalariData): Detail | null {
        const { room } = data;

        // If the room is equal to "mim", return `null`.
        // This means that there is no room for the lesson, because it's outside
        if (room === "mim") return null;

        // Get the room from the handler
        return this.#details.getOneByName(room);
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
                const classDetails = className ? this.#details.getOneByName<ClassDetail>(className) : null;

                // Return the group
                return new Group(classDetails, number ? Number(number) : null);
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

    /** Parse absence type (only works for authenticated schedules) */
    #absenceType(node: IElement): BakalariAbsenceType | null {
        // Get the absence info node. Return null if it doesn't exist
        const absenceInfoNode = node.querySelector(".absence");
        if (!absenceInfoNode) return null;

        // Parse the class name from the node
        const className = absenceInfoNode.getAttribute("class");
        const absenceInfo = className?.match(/_Absent[a-zA-Z]*/)?.[0] ?? null;

        // Return the absence info
        return absenceInfo as BakalariAbsenceType;
    }

    /** Parse homework (only works for authenticated schedules) */
    #homework(data: BakalariData): string[] {
        // Get the homework from the data
        const homework = data.homeworks;

        // Return the homework
        return homework ?? [];
    }
}

export default BakalariLessonParser;
