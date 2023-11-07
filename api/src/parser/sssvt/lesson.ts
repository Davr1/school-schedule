import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

import { LessonCancellation, type LessonChange, LessonSubstitution } from "@/classes";

class SSSVTLessonParser {
    // constructor(private details: DetailHandler) {}

    /**
     * Parse data about a lesson substitution
     *
     * @param lesson The lesson to parse
     */
    parse(lesson: AnyNode): LessonChange | undefined {
        // Check if the lesson has any text inside, if not, return
        if (!textContent(lesson).trim()) return;

        // Get the group number and subject abbreviation
        const group = this.group(lesson) ?? null;
        const subject = this.subject(lesson) ?? null;

        // If there's no subject, it means that the lesson is cancelled
        // Note: Only check for null because the value can be an empty string
        if (subject === null) return new LessonCancellation(group);

        // Get the room number and teacher abbreviation
        const room = this.room(lesson) ?? null;
        const teacher = this.teacher(lesson) ?? null;

        // If there's no room, throw an error
        if (!room) throw new Error(`Couldn't find the room in lesson: ${textContent(lesson)}`);

        return new LessonSubstitution(group, subject, room, teacher);
    }

    /** Parse the group number from the given lesson node */
    private group(lesson: AnyNode): number | undefined {
        // Parse the group number from the lesson content in the format: (N.sk)
        const content = textContent(lesson);
        const match = content.match(/(?<=\()[0-9](?=\.sk\))/)?.[0];

        // If it exists, return it as a number
        if (match) return parseInt(match);
    }

    /** Parse the subject abbreviation from a lesson */
    private subject(lesson: AnyNode): string | undefined {
        // Get the subject abbreviation from the lesson
        const subject = selectOne("strong", lesson);

        // The subject is in the text content of the <strong> tag
        if (subject) return textContent(subject).trim();
    }

    /** Parse the room for the given lesson */
    private room(lesson: AnyNode): string | undefined {
        // Get the room number from the <a> tag with an href attribute
        const link = selectOne("[href*='/room/']", lesson);

        // The room is in the text content of the link
        if (link) return textContent(link).trim();
    }

    /** Parse the teacher's abbreviation from a lesson */
    private teacher(lesson: AnyNode): string | undefined {
        // Get the teacher's abbreviation from the link
        const teacher = selectOne("[href*='/teacher/']", lesson);

        // The teacher abbreviation is in the text content of the <em> tag
        if (teacher) return textContent(teacher).trim();
    }
}

export default SSSVTLessonParser;
