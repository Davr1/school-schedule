import { type AnyBakalariLesson, BakalariLesson, type BakalariLessonJSON } from "@/classes/bakalari";
import type { DetailHandler } from "@/classes/details";
import { type AnyLessonChange, LessonChange, type LessonChangeJSON } from "@/classes/sssvt/change";

/** Lesson seralized to JSON */
export interface LessonJSON {
    bakalari: BakalariLessonJSON | null;
    sssvt: LessonChangeJSON | null;
}

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
