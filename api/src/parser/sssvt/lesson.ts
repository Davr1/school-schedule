import { type AnySSSVTChange, Detail, DetailHandler, DetailType, SSSVTCancellation, SSSVTSubstitution, TeacherDetail } from "@/classes";
import type { IElement } from "@/parser/interfaces";

class SSSVTLessonParser {
    #details: DetailHandler;

    constructor(details: DetailHandler) {
        this.#details = details;
    }

    /**
     * Parse data about a lesson substitution
     *
     * @param lesson The lesson to parse
     */
    parse(lesson: IElement): AnySSSVTChange | undefined {
        // Check if the lesson has any text inside, if not, return
        if (!lesson.textContent?.trim()) return;

        // Get the group number and subject
        const group = this.#group(lesson);
        const subject = this.#subject(lesson);

        // If there's no subject, it means that the lesson is cancelled
        // Note: Only check for undefined because the value can be null (which means that the subject wasn't specified)
        if (subject === undefined) return new SSSVTCancellation(group);

        // Get the room number and teacher
        const room = this.#room(lesson);
        const teacher = this.#teacher(lesson) ?? null;

        return new SSSVTSubstitution(group, subject, teacher, room);
    }

    /** Parse the group number from the given lesson node */
    #group(lesson: IElement): number | null {
        // Parse the group number from the lesson content in the format: (N.sk)
        const match = lesson.textContent?.match(/(?<=\()[0-9](?=\.sk\))/)?.[0];

        // If it exists, return it as a number
        if (match) return parseInt(match);
        return null;
    }

    /** Parse the subject abbreviation from a lesson */
    #subject(lesson: IElement): Detail | null | undefined {
        // Get the subject abbreviation from the lesson
        // The subject abbreviation is in the text content of the <strong> tag
        let subject = lesson.querySelector("strong")?.textContent?.trim();

        if (subject === undefined) return; // Undefined => cancelled lesson
        if (subject === "") return null; // Empty string => no subject specified

        // If the subject is "POS", replace it with "SPS" (it's the same subject)
        if (subject === "POS") subject = "SPS";

        // Find the subject detail (or add it if it doesn't exist)
        return this.#details.get(subject, () => new Detail(DetailType.Subject, subject!, null));
    }

    /** Parse the room for the given lesson */
    #room(lesson: IElement): Detail {
        // Get the room number from the <a> tag with an href attribute
        const link = lesson.querySelector("[href*='/room/']");

        // The room name is in the text content of the link
        const name = link?.textContent?.trim();
        if (!name) throw new Error("Couldn't find the room in lesson");

        // Find the room detail (or add it if it doesn't exist)
        const room = this.#details.getByName(name, () => new Detail(DetailType.Room, name, name));

        return room;
    }

    /** Parse the teacher's abbreviation from a lesson */
    #teacher(lesson: IElement): TeacherDetail | null {
        // Get the teacher's abbreviation from the link
        // The teacher abbreviation is in the text content of the <em> tag
        const teacher = lesson.querySelector("[href*='/teacher/']")?.textContent?.trim();
        if (!teacher) return null;

        // Find the teacher detail (or add it if it doesn't exist)
        return this.#details.getByAbbreviation<TeacherDetail>(teacher, () => new TeacherDetail(teacher, teacher, null));
    }
}

export default SSSVTLessonParser;
