import { type Detail, type DetailHandler, TeacherDetail } from "@/classes/details";
import type { AnySSSVTChangeJSON, SSSVTCancellationJSON, SSSVTSubstitutionJSON } from "@/schemas";

/** The type of a sssvt lesson change */
export const enum SSSVTChangeType {
    /** The lesson was cancelled */
    Cancellation = "cancelled",

    /** The lesson was substituted for a different one */
    Substitution = "substituted"
}

/** Any lesson change */
export type AnySSSVTChange = SSSVTCancellation | SSSVTSubstitution;

/** Base class for a lesson change on the SSSVT schedule */
export abstract class BaseSSSVTChange {
    abstract readonly type: SSSVTChangeType;

    constructor(
        /** The group number of the changed lesson, null if the whole class is affected */
        readonly group: number | null
    ) {}

    /** Deserialize the lesson from JSON */
    static fromJSON(json: AnySSSVTChangeJSON, handler: DetailHandler): AnySSSVTChange {
        if (json.type === SSSVTChangeType.Substitution) return SSSVTSubstitution.fromJSON(json as SSSVTSubstitutionJSON, handler);
        else if (json.type === SSSVTChangeType.Cancellation) return SSSVTCancellation.fromJSON(json as SSSVTCancellationJSON);
        else throw new Error(`Unknown lesson type: ${(json as AnySSSVTChangeJSON).type}`);
    }

    // Type guards

    isCancellation(): this is SSSVTCancellation {
        return this.type === SSSVTChangeType.Cancellation;
    }

    isSubstitution(): this is SSSVTSubstitution {
        return this.type === SSSVTChangeType.Substitution;
    }
}

/** A lesson cancellation */
export class SSSVTCancellation extends BaseSSSVTChange {
    readonly type = SSSVTChangeType.Cancellation;

    /** Deserialize the lesson from JSON */
    static fromJSON(json: SSSVTCancellationJSON): SSSVTCancellation {
        return new SSSVTCancellation(json.group ?? null);
    }
}

/** A lesson substitution */
export class SSSVTSubstitution extends BaseSSSVTChange {
    readonly type = SSSVTChangeType.Substitution;

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
    toJSON(): SSSVTSubstitutionJSON {
        return {
            ...this,
            subject: this.subject?.toString() ?? null,
            teacher: this.teacher?.toString() ?? null,
            room: this.room.toString()
        };
    }

    /** Deserialize the lesson from JSON */
    static fromJSON(json: SSSVTSubstitutionJSON, handler: DetailHandler): SSSVTSubstitution {
        // Get the details
        const subject = json.subject ? handler.getOne(json.subject) : null;
        const teacher = json.teacher ? handler.getOne<TeacherDetail>(json.teacher) : null;
        const room = handler.getOne(json.room);

        return new SSSVTSubstitution(json.group ?? null, subject, teacher, room);
    }
}
