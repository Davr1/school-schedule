import type { BakalariLesson } from "@/classes/bakalari";
import type { LessonChange } from "@/classes/sssvt/change";

/* A merged lesson */
class Lesson {
    get empty() {
        return !this.bakalari && !this.sssvt;
    }

    constructor(
        /** The Bakalari lesson */
        public bakalari: BakalariLesson | null,

        /** The SSSVT lesson */
        public sssvt: LessonChange | null
    ) {}
}

export default Lesson;
