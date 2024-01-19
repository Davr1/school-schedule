import { type AnyBakalariLesson, BakalariLesson } from "@/classes/bakalari";
import type { DetailHandler } from "@/classes/details";
import { type AnyLessonChange, LessonChange } from "@/classes/sssvt/change";
import type { LessonJSON } from "@/schemas";

/* A merged lesson */
class Lesson {
    get empty(): boolean {
        return !this.bakalari && !this.sssvt;
    }

    /** Whether Bakalari and SSSVT info is conflicting */
    get conflict(): boolean {
        // Can't have a conflict if there's no SSSVT lesson
        if (!this.bakalari || !this.sssvt) return false;

        // Ignore absences, cuz sssvt doesn't have them
        if (this.bakalari.isAbsence()) return false;

        // Normal / changed lesson
        if (this.bakalari.isNormal() && this.sssvt.isSubstitution()) {
            return (
                // There's a conflict if:
                // Subjects are different (SSSVT doesn't always have a subject)
                (this.bakalari.subject !== null && this.sssvt.subject !== null && this.bakalari.subject.id !== this.sssvt.subject.id) ||
                // Room is different, there's a conflict
                this.bakalari.room.id !== this.sssvt.room.id ||
                // Teacher is different (SSSVT doesn't always have a teacher)
                (this.sssvt.teacher && this.bakalari.teacher!.id !== this.sssvt.teacher.id) ||
                // Groups are different (SSSVT can only have one group, so check if the bakalari lesson has more than one)
                // Note that SSSVT sometimes removes the group, but Bakalari doesn't.. so we can ignore SSSVT being null and Bakalari not
                (this.sssvt.group !== null && (this.bakalari.groups.length > 1 || this.bakalari.groups[0]?.number !== this.sssvt.group))
            );
        }

        // Removed lesson
        if (this.bakalari.isRemoved() && this.sssvt.isCancellation()) return false;

        // If the types are different, there's a conflict
        return true;
    }

    constructor(
        /** The Bakalari lesson */
        public bakalari: AnyBakalariLesson | null,

        /** The SSSVT lesson */
        public sssvt: AnyLessonChange | null = null
    ) {}

    /** Deserialize the lesson from JSON */
    static fromJSON(json: LessonJSON, handler: DetailHandler): Lesson {
        return new Lesson(
            json.bakalari ? BakalariLesson.fromJSON(json.bakalari, handler) : null,
            json.sssvt ? LessonChange.fromJSON(json.sssvt, handler) : null
        );
    }
}

export default Lesson;
