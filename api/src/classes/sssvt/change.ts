import { type DetailHandler, type Details, TeacherDetails } from "@/classes/details";

/** The type of a lesson change */
export const enum LessonChangeType {
    /** The lesson was cancelled */
    Cancellation = "cancelled",

    /** The lesson was substituted for a different one */
    Substitution = "substituted"
}

/** Lesson seralized to JSON */
export type LessonChangeJSON<T extends LessonChange = AnyLessonChange> = Omit<
    T,
    "isCancellation" | "isSubstitution" | "subject" | "teacher" | "toJSON"
> &
    (T extends LessonSubstitution ? { subject: string; teacher: string | null } : {});

/** Any lesson change */
export type AnyLessonChange = LessonCancellation | LessonSubstitution;

/** Any change to a lesson (abstract) */
export abstract class LessonChange {
    abstract readonly type: LessonChangeType;

    constructor(
        /** The group number of the changed lesson, null if the whole class is affected */
        readonly group: number | null
    ) {}

    /** Deserialize the lesson from JSON */
    static fromJSON(json: LessonChangeJSON<LessonChange>, handler: DetailHandler): AnyLessonChange {
        if (json.type === LessonChangeType.Substitution)
            return LessonSubstitution.fromJSON(json as LessonChangeJSON<LessonSubstitution>, handler);
        else if (json.type === LessonChangeType.Cancellation)
            return LessonCancellation.fromJSON(json as LessonChangeJSON<LessonCancellation>);
        else throw new Error(`Unknown lesson type: ${json.type}`);
    }

    // Type guards

    isCancellation(): this is LessonCancellation {
        return this.type === LessonChangeType.Cancellation;
    }

    isSubstitution(): this is LessonSubstitution {
        return this.type === LessonChangeType.Substitution;
    }
}

/** A lesson cancellation */
export class LessonCancellation extends LessonChange {
    readonly type = LessonChangeType.Cancellation;

    /** Deserialize the lesson from JSON */
    static fromJSON(json: LessonChangeJSON<LessonCancellation>): LessonCancellation {
        return new LessonCancellation(json.group);
    }
}

/** A lesson substitution */
export class LessonSubstitution extends LessonChange {
    readonly type = LessonChangeType.Substitution;

    constructor(
        group: number | null,

        /** The new subject */
        readonly subject: "" | Details,

        /** The room the lesson is taught in */
        readonly room: string,

        /** The teacher's details (can be null in rare cases) */
        readonly teacher: TeacherDetails | null
    ) {
        super(group);
    }

    /** Serialize the lesson to JSON */
    toJSON(): LessonChangeJSON<LessonSubstitution> {
        return {
            ...this,
            subject: this.subject.toString(),
            teacher: this.teacher?.toString() ?? null
        };
    }

    /** Deserialize the lesson from JSON */
    static fromJSON(json: LessonChangeJSON<LessonSubstitution>, handler: DetailHandler): LessonSubstitution {
        // Get the subject details
        const subject = json.subject && handler.getDetail(json.subject);
        const teacher = json.teacher ? handler.getDetail<TeacherDetails>(json.teacher) : null;

        // Check if the details exist
        if (subject === undefined) throw new Error(`Subject with id ${json.subject} not found`);
        if (teacher === undefined) throw new Error(`Teacher with id ${json.teacher} not found`);

        return new LessonSubstitution(json.group, subject, json.room, teacher);
    }
}
