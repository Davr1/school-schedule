import { type AnyLessonChange, Detail, DetailHandler, DetailType, LessonCancellation, LessonSubstitution, TeacherDetail } from "@/classes";
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
    parse(lesson: IElement): AnyLessonChange | undefined {
        // Check if the lesson has any text inside, if not, return
        if (!lesson.textContent?.trim()) return;

        // Get the group number and subject abbreviation
        const group = this.#group(lesson) ?? null;
        const subjectAbbreviation = this.#subject(lesson) ?? null;

        // If there's no subject, it means that the lesson is cancelled
        // Note: Only check for null because the value can be an empty string
        if (subjectAbbreviation === null) return new LessonCancellation(group);

        // Find the subject detail (or add it if it doesn't exist)
        const subject = subjectAbbreviation
            ? this.#details.get(subjectAbbreviation, () => new Detail(DetailType.Subject, subjectAbbreviation, null))
            : null;

        // Get the room number and teacher abbreviation
        const room = this.#room(lesson) ?? null;
        const teacherAbbreviation = this.#teacher(lesson) ?? null;

        // Find the teacher detail (or add it if it doesn't exist)
        const teacher =
            teacherAbbreviation !== null
                ? this.#details.getByAbbreviation<TeacherDetail>(
                      teacherAbbreviation,
                      () => new TeacherDetail(teacherAbbreviation, null, teacherAbbreviation)
                  )
                : null;

        // If there's no room, throw an error
        if (!room) throw new Error(`Couldn't find the room in lesson: ${lesson.textContent}`);

        return new LessonSubstitution(group, subject, teacher, room);
    }

    /** Parse the group number from the given lesson node */
    #group(lesson: IElement): number | undefined {
        // Parse the group number from the lesson content in the format: (N.sk)
        const match = lesson.textContent?.match(/(?<=\()[0-9](?=\.sk\))/)?.[0];

        // If it exists, return it as a number
        if (match) return parseInt(match);
    }

    /** Parse the subject abbreviation from a lesson */
    #subject(lesson: IElement): string | undefined {
        // Get the subject abbreviation from the lesson
        const subject = lesson.querySelector("strong");

        // The subject is in the text content of the <strong> tag
        return subject?.textContent?.trim();
    }

    /** Parse the room for the given lesson */
    #room(lesson: IElement): Detail | undefined {
        // Get the room number from the <a> tag with an href attribute
        const link = lesson.querySelector("[href*='/room/']");

        // The room name is in the text content of the link
        const name = link?.textContent?.trim();
        if (!name) return;

        // Find the room detail (or add it if it doesn't exist)
        const room = this.#details.getByName(name, () => new Detail(DetailType.Room, name, name));

        return room;
    }

    /** Parse the teacher's abbreviation from a lesson */
    #teacher(lesson: IElement): string | undefined {
        // Get the teacher's abbreviation from the link
        const teacher = lesson.querySelector("[href*='/teacher/']");

        // The teacher abbreviation is in the text content of the <em> tag
        return teacher?.textContent?.trim();
    }
}

export default SSSVTLessonParser;
