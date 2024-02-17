import {
    AbsenceBakalariLesson,
    type AnyBakalariLesson,
    type BakalariAbsenceType,
    BaseBakalariLesson,
    NormalBakalariLesson,
    RemovedBakalariLesson
} from "@/classes/bakalari/lesson";
import type { Detail, DetailHandler, TeacherDetail } from "@/classes/details";
import type { Group } from "@/classes/schedule/group";
import { type AnySSSVTChange, BaseSSSVTChange, SSSVTCancellation, SSSVTSubstitution } from "@/classes/sssvt/change";
import type { AnyLessonJSON, ConflictLessonJSON, NormalLessonJSON, RemovedLessonJSON } from "@/schemas";

/** Lesson types */
export const enum LessonType {
    /** Conflicting lesson */
    Conflict = "conflict",

    /** Normal lesson */
    Normal = "normal",

    /** Removed lesson */
    Removed = "removed"
}

/** Any lesson */
export type AnyLesson = ConflictLesson | NormalLesson | RemovedLesson;

/* A base lesson */
export abstract class BaseLesson {
    abstract type: LessonType;

    /** Whether a lesson change occured */
    abstract get change(): boolean;

    constructor(
        /** The Bakalari lesson */
        public bakalari: AnyBakalariLesson | null,

        /** The SSSVT lesson change */
        public sssvt: AnySSSVTChange | null = null
    ) {}

    /** Deserialize the lesson from JSON */
    static fromJSON(json: AnyLessonJSON, handler: DetailHandler): AnyLesson {
        switch (json.type) {
            case "conflict":
                return ConflictLesson.fromJSON(json as ConflictLessonJSON, handler);
            case "normal":
                return NormalLesson.fromJSON(json as NormalLessonJSON, handler);
            case "removed":
                return RemovedLesson.fromJSON(json as RemovedLessonJSON, handler);
        }
    }

    static merge(bakalari?: AnyBakalariLesson | null, sssvt?: AnySSSVTChange | null): AnyLesson {
        // Both null => conflict cuz of empty lesson
        if (!bakalari && !sssvt) return new ConflictLesson(null, null);

        if (!bakalari) return sssvt!.isSubstitution() ? new NormalLesson(null, sssvt) : new RemovedLesson(null, sssvt!);
        if (!sssvt) return bakalari.isNormal() ? new NormalLesson(bakalari, null) : new RemovedLesson(bakalari, null);

        if (this.#conflict(bakalari, sssvt)) return new ConflictLesson(bakalari, sssvt);

        if (bakalari.isNormal()) return new NormalLesson(bakalari, sssvt as SSSVTSubstitution);
        else return new RemovedLesson(bakalari, sssvt as SSSVTCancellation);
    }

    /** Check whether a sssvt lesson change and bakalari lesson conflict */
    static #conflict(bakalari?: AnyBakalariLesson, sssvt?: AnySSSVTChange): boolean {
        // Can't have a conflict if there's no SSSVT lesson
        if (!bakalari || !sssvt) return false;

        // Normal / changed lesson
        if (bakalari.isNormal() && sssvt.isSubstitution()) {
            return (
                // There's a conflict if:
                // Subjects are different (SSSVT doesn't always have a subject)
                (bakalari.subject && sssvt.subject && bakalari.subject.id !== sssvt.subject.id) ||
                // Room is different, there's a conflict
                (bakalari.room && sssvt.room && bakalari.room.id !== sssvt.room.id) ||
                // Teacher is different (SSSVT doesn't always have a teacher)
                (sssvt.teacher && bakalari.teacher!.id !== sssvt.teacher.id) ||
                // Groups are different (SSSVT can only have one group, so check if the bakalari lesson has more than one)
                // Note that SSSVT sometimes removes the group, but Bakalari doesn't.. so we can ignore SSSVT being null and Bakalari not
                (sssvt.group !== null && (bakalari.groups.length > 1 || bakalari.groups[0]?.number !== sssvt.group))
            );
        }

        // Removed / Absence lesson
        if ((bakalari.isRemoved() || bakalari.isAbsence()) && sssvt.isCancellation()) return false;

        // If the types are different, there's a conflict
        return true;
    }
}

export class ConflictLesson extends BaseLesson {
    type = LessonType.Conflict as const;

    get change(): boolean {
        return true;
    }

    static fromJSON(json: ConflictLessonJSON, handler: DetailHandler): ConflictLesson {
        return new ConflictLesson(
            json.bakalari ? BaseBakalariLesson.fromJSON(json.bakalari, handler) : null,
            json.sssvt ? BaseSSSVTChange.fromJSON(json.sssvt, handler) : null
        );
    }
}

export class NormalLesson extends BaseLesson {
    type = LessonType.Normal as const;

    /** Lesson topic */
    get topic(): string | null {
        return this.bakalari?.topic ?? null;
    }

    /** Subject detail */
    get subject(): Detail | null {
        return this.bakalari?.subject ?? this.sssvt?.subject ?? null;
    }

    /** Teacher detail */
    get teacher(): TeacherDetail | null {
        return this.bakalari?.teacher ?? this.sssvt?.teacher ?? null;
    }

    /** Room detail */
    get room(): Detail | null {
        return this.bakalari?.room ?? this.sssvt?.room ?? null;
    }

    /** Class groups */
    get groups(): Group[] {
        return this.bakalari?.groups ?? [];
    }

    get change(): boolean {
        if (this.sssvt) return true;

        return this.bakalari?.change !== null;
    }

    /** Absence type (if the schedule is from an authenticated source) */
    get absence(): BakalariAbsenceType | null {
        return this.bakalari?.absence ?? null;
    }

    /** Homework (also only for authenticated schedules) */
    get homework(): string[] {
        return this.bakalari?.homework ?? [];
    }

    constructor(
        /** The Bakalari lesson */
        public bakalari: NormalBakalariLesson | null,

        /** The SSSVT lesson */
        public sssvt: SSSVTSubstitution | null = null
    ) {
        super(bakalari, sssvt);
    }

    static fromJSON(json: NormalLessonJSON, handler: DetailHandler): NormalLesson {
        return new NormalLesson(
            json.bakalari ? NormalBakalariLesson.fromJSON(json.bakalari, handler) : null,
            json.sssvt ? SSSVTSubstitution.fromJSON(json.sssvt, handler) : null
        );
    }
}

export class RemovedLesson extends BaseLesson {
    type = LessonType.Removed as const;

    get change(): true {
        return true;
    }

    /** Lesson info  (will either usually be "Absc" or another short abbreviation) */
    get info(): string | null {
        return this.bakalari?.isAbsence() ? this.bakalari.info : null;
    }

    /** Lesson name (will either be "Obecná absence ..." or the change string for removed lessons) */
    get name(): string | null {
        return this.bakalari?.isAbsence() ? this.bakalari.name : this.bakalari?.change ?? null;
    }

    constructor(
        /** The Bakalari lesson */
        public bakalari: RemovedBakalariLesson | AbsenceBakalariLesson | null,

        /** The SSSVT lesson */
        public sssvt: SSSVTCancellation | null = null
    ) {
        super(bakalari, sssvt);
    }

    static fromJSON(json: RemovedLessonJSON, handler: DetailHandler): RemovedLesson {
        return new RemovedLesson(
            json.bakalari
                ? json.bakalari.type === "removed"
                    ? RemovedBakalariLesson.fromJSON(json.bakalari)
                    : AbsenceBakalariLesson.fromJSON(json.bakalari)
                : null,
            json.sssvt ? SSSVTCancellation.fromJSON(json.sssvt) : null
        );
    }
}
