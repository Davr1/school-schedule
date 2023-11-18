import { type Detail, type DetailHandler, TeacherDetail } from "@/classes/details";

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
    (T extends LessonSubstitution ? { subject: string | null; teacher: string | null; room: string } : {});

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
        readonly subject: Detail | null,

        /** The teacher's detail (can be null in rare cases) */
        readonly teacher: TeacherDetail | null,

        /** The room the lesson is taught in */
        readonly room: Detail
    ) {
        super(group);
    }

    /** Serialize the lesson to JSON */
    toJSON(): LessonChangeJSON<LessonSubstitution> {
        return {
            ...this,
            subject: this.subject?.toString() ?? null,
            teacher: this.teacher?.toString() ?? null,
            room: this.room.toString()
        };
    }

    /** Deserialize the lesson from JSON */
    static fromJSON(json: LessonChangeJSON<LessonSubstitution>, handler: DetailHandler): LessonSubstitution {
        // Get the details
        const subject = json.subject ? handler.get(json.subject) : null;
        const teacher = json.teacher ? handler.get<TeacherDetail>(json.teacher) : null;
        const room = handler.get(json.room);

        // Check if the details exist
        if (subject === undefined) throw new Error(`Subject with id ${json.subject} not found`);
        if (teacher === undefined) throw new Error(`Teacher with id ${json.teacher} not found`);
        if (room === undefined) throw new Error(`Room with id ${json.room} not found`);

        return new LessonSubstitution(json.group, subject, teacher, room);
    }
}
