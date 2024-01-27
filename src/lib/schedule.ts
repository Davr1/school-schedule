/** Web specific modifications to the schedule api model */
import {
    type AnyLesson,
    type BaseLesson,
    type ConflictLesson,
    LessonType,
    type NormalLesson,
    type RemovedLesson,
    type Schedule
} from "@school-schedule/api/classes";

export class Cell<T extends BaseLesson = AnyLesson> {
    /** Type of the lesson in the cell. Will be the same for all lessons in the cell */
    get type(): T["type"] {
        return this.lessons[0].type;
    }

    constructor(
        /** X coordinate of the cell */
        public x: number,

        /** Y coordinate of the cell */
        public y: number,

        /** Lessons in the cell */
        public lessons: T[],

        /** Width of the cell */
        public width: number,

        /** Height of the cell */
        public height: number
    ) {}

    /** Convert a schedule to an array of cells, which can be used to render the schedule */
    static fromSchedule(schedule: Schedule, merge = true): Cell[] {
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
                    return new Cell(i, 0, [lesson1, lesson2], 1, 2);
                } else {
                    // Otherwise, add them as separate cells
                    return [new Cell(i, 0, [lesson1], 1, 1), new Cell(i, 1, [lesson2], 1, 1)];
                }
            }

            // only 1 lesson in the period => add it as a cell
            else {
                // Use the smaller height for the cell if the lesson is a normal lesson with groups that have a class
                if (lesson1.type === LessonType.Normal && lesson1.groups.length > 0 && lesson1.groups.every((g) => g.class === null)) {
                    // +1 because odd group numbers should come first
                    const y = (lesson1.groups[0].number! + 1) % 2;

                    return new Cell(i, y, [lesson1], 1, 1);
                } else {
                    return new Cell(i, 0, [lesson1], 1, 2);
                }
            }
        });
    }

    // Type guards for the lesson type

    isNormal(): this is Cell<NormalLesson> {
        return this.type === LessonType.Normal;
    }

    isRemoved(): this is Cell<RemovedLesson> {
        return this.type === LessonType.Removed;
    }

    isConflict(): this is Cell<ConflictLesson> {
        return this.type === LessonType.Conflict;
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
