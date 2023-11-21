import { type AnyBakalariLesson, BakalariLesson } from "@/classes/bakalari";
import type { DetailHandler } from "@/classes/details";
import { type AnyLessonChange, LessonChange } from "@/classes/sssvt/change";
import type { LessonJSON } from "@/schemas";

/* A merged lesson */
class Lesson {
    get empty() {
        return !this.bakalari && !this.sssvt;
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
