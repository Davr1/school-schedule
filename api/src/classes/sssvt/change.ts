export const enum LessonChangeType {
    /** The lesson was cancelled */
    Cancellation,

    /** The lesson was substituted for a different one */
    Substitution
}

/**
 * Used for the `fromObject` static methods of the LessonCancelation classes
 *
 * Omit these properties that are not needed in the `fromObject` method
 * @internal
 */
type IgnoredProperties = "type" | "isCancellation" | "isSubstitution";

/** Any change to a lesson (abstract) */
export abstract class LessonChange {
    abstract readonly type: LessonChangeType;

    constructor(
        /** The group number of the changed lesson, null if the whole class is affected */
        readonly group: number | null
    ) {}

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

    /** Create a new LessonCancellation from an object of the same structure */
    static fromObject(object: Omit<LessonCancellation, IgnoredProperties>): LessonCancellation {
        return new LessonCancellation(object.group);
    }
}

/** A lesson substitution */
export class LessonSubstitution extends LessonChange {
    readonly type = LessonChangeType.Substitution;

    constructor(
        group: number | null,

        /** The subject (abbreviation) of the substitution */
        readonly subject: string,

        /** The room the lesson is taught in */
        readonly room: string,

        /** The teacher's abbreviation (can be null in rare cases) */
        readonly teacher: string | null
    ) {
        super(group);
    }

    /** Create a new LessonSubstitution from an object of the same structure */
    static fromObject(object: Omit<LessonSubstitution, IgnoredProperties>): LessonSubstitution {
        return new LessonSubstitution(object.group, object.subject, object.room, object.teacher);
    }
}
