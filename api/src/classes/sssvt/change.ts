import { type Detail, type DetailHandler, TeacherDetail } from "@/classes/details";
import type { AnyLessonChangeJSON, LessonCancellationJSON, LessonSubstitutionJSON } from "@/schemas";

/** The type of a lesson change */
export const enum LessonChangeType {
    /** The lesson was cancelled */
    Cancellation = "cancelled",

    /** The lesson was substituted for a different one */
    Substitution = "substituted"
}

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
    static fromJSON(json: AnyLessonChangeJSON, handler: DetailHandler): AnyLessonChange {
        if (json.type === LessonChangeType.Substitution) return LessonSubstitution.fromJSON(json as LessonSubstitutionJSON, handler);
        else if (json.type === LessonChangeType.Cancellation) return LessonCancellation.fromJSON(json as LessonCancellationJSON);
        else throw new Error(`Unknown lesson type: ${(json as AnyLessonChangeJSON).type}`);
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
    static fromJSON(json: LessonCancellationJSON): LessonCancellation {
        return new LessonCancellation(json.group ?? null);
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
    toJSON(): LessonSubstitutionJSON {
        return {
            ...this,
            subject: this.subject?.toString() ?? null,
            teacher: this.teacher?.toString() ?? null,
            room: this.room.toString()
        };
    }

    /** Deserialize the lesson from JSON */
    static fromJSON(json: LessonSubstitutionJSON, handler: DetailHandler): LessonSubstitution {
        // Get the details
        const subject = json.subject ? handler.getOne(json.subject) : null;
        const teacher = json.teacher ? handler.getOne<TeacherDetail>(json.teacher) : null;
        const room = handler.getOne(json.room);

        return new LessonSubstitution(json.group ?? null, subject, teacher, room);
    }
}
