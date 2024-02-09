/** Web specific modifications to the schedule api model */
import {
    type AnyLesson,
    BakalariAbsenceType,
    type Detail,
    Group,
    LessonType,
    type NormalLesson,
    type RemovedLesson,
    type Schedule,
    type TeacherDetail
} from "@school-schedule/api/classes";

export type AnyCell = NormalCell | RemovedCell;

export abstract class Cell {
    /** Type of the lesson in the cell. Will be the same for all lessons in the cell */
    abstract type: LessonType;

    get style(): string {
        return `--row: ${this.y}; --column: ${this.x}; --width: ${this.width}; --height: ${this.height};`;
    }

    /** Cell title */
    abstract get title(): string | null;

    constructor(
        /** X coordinate of the cell */
        public x: number,

        /** Y coordinate of the cell */
        public y: number,

        /** Lessons in the cell */
        public lessons: AnyLesson[],

        /** Width of the cell */
        public width: number,

        /** Height of the cell */
        public height: number
    ) {}

    /** Create a cell from lessons */
    static #create(x: number, y: number, lessons: AnyLesson[], width: number, height: number): AnyCell {
        const type = lessons[0].type;
        if (lessons.some((l) => l.type !== type)) throw new Error("All lessons in a cell must be of the same type");

        if (type === LessonType.Normal) return new NormalCell(x, y, lessons, width, height);
        else if (type === LessonType.Removed) return new RemovedCell(x, y, lessons, width, height);

        throw new Error(`Unknown lesson type: ${type}`);
    }

    /** Convert a schedule to an array of cells, which can be used to render the schedule */
    static fromSchedule(schedule: Schedule, merge = true): AnyCell[] {
        // The day index starts with Sunday (0), but we want to start with Monday (1) so we need to subtract 1
        // There's also 2 rows per day, so we need to multiply the day index by 2
        const row = (schedule.day - 1) * 2;

        return schedule.periods.flatMap((lessons, i) => {
            // Throw if there's more than 2 lessons in a period
            if (lessons.length > 2) throw new Error("Too many lessons in a period, can't render");

            // Sort the lessons by group number, when possible
            const [lesson1, lesson2] = [...lessons].sort((a, b) =>
                a.type === LessonType.Normal && b.type === LessonType.Normal ? a.groups[0].number! - b.groups[0].number! : 0
            );

            // If there's no lessons in the period, return an empty cell
            if (!lesson1) return [];

            // 2 lessons in the period => merge them if possible
            if (lesson2) {
                if (merge && this.#canMerge(lesson1, lesson2)) {
                    // If merging is enabled, and the lessons are compatible, merge them
                    return Cell.#create(i, row, [lesson1, lesson2], 1, 2);
                } else {
                    // Otherwise, add them as separate cells
                    return [Cell.#create(i, row, [lesson1], 1, 1), Cell.#create(i, row + 1, [lesson2], 1, 1)];
                }
            }

            // only 1 lesson in the period => add it as a cell
            else {
                // Use the smaller height for the cell if the lesson is a normal lesson with groups that have a class
                if (lesson1.type === LessonType.Normal && lesson1.groups.length > 0 && lesson1.groups.every((g) => g.class === null)) {
                    // +1 because odd group numbers should come first
                    const y = (lesson1.groups[0].number! + 1) % 2;

                    return Cell.#create(i, row + y, [lesson1], 1, 1);
                } else {
                    return Cell.#create(i, row, [lesson1], 1, 2);
                }
            }
        });
    }

    /** Can two lessons be merged */
    static #canMerge(lesson1: AnyLesson, lesson2: AnyLesson): boolean {
        // If at least one of the lessons is a conflict, they can't be merged
        if (lesson1.type === LessonType.Conflict || lesson2.type === LessonType.Conflict) return false;

        if (lesson1.type === LessonType.Normal && lesson2.type === LessonType.Normal) {
            // If both lessons are normal, they can be merged if they have the same subject, room and teacher
            return (
                lesson1.subject?.id === lesson2.subject?.id &&
                lesson1.room?.id === lesson2.room?.id &&
                lesson1.teacher?.id === lesson2.teacher?.id
            );
        }

        // Otherwise, don't merge
        return false;
    }
}

export class NormalCell extends Cell {
    type = LessonType.Normal as const;

    declare lessons: NormalLesson[];

    /** Unique topics in the cell */
    get topics(): string[] {
        return this.lessons.flatMap((lesson) => lesson.topic ?? []).filter((topic, index, array) => array.indexOf(topic) === index);
    }

    /** Subject detail (will be the same for all lessons in the cell) */
    get subject(): Detail | null {
        return this.lessons[0].subject;
    }

    /** Teacher detail */
    get teacher(): TeacherDetail | null {
        return this.lessons[0].teacher;
    }

    /** Room detail */
    get room(): Detail | null {
        return this.lessons[0].room;
    }

    /** Class groups */
    get groups(): Group[] {
        return this.lessons.flatMap((lesson) => lesson.groups);
    }

    /** Absence type */
    get absence(): BakalariAbsenceType | null {
        // TODO: Change
        for (const lesson of this.lessons) {
            if (lesson.absence) return lesson.absence;
        }

        return null;
    }

    /** Homework */
    get homework(): string[] {
        return this.lessons.flatMap((lesson) => lesson.homework);
    }

    get change(): boolean {
        return this.lessons.some((lesson) => lesson.change);
    }

    get title(): string {
        return [...this.topics, "", this.subject?.name, this.teacher?.fullName, this.room?.name, Group.name(this.groups)]
            .filter((item) => item !== null && item !== undefined)
            .join("\n")
            .trim();
    }
}

export class RemovedCell extends Cell {
    type = LessonType.Removed as const;

    declare lessons: RemovedLesson[];

    /** Lesson info */
    get info(): string | null {
        for (const lesson of this.lessons) {
            if (lesson.info) return lesson.info;
        }

        return null;
    }

    /** Lesson name / change string */
    get name(): string | null {
        for (const lesson of this.lessons) {
            if (lesson.name) return lesson.name;
        }

        return null;
    }

    get title(): string | null {
        return this.name ?? this.info ?? null;
    }

    /** Whether the cell is active (has info and name) */
    get active(): boolean {
        return Boolean(this.info && this.name);
    }
}
