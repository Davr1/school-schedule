import type { Detail, DetailHandler, TeacherDetail } from "@/classes/details";
import { Group } from "@/classes/schedule/group";
import type { AbsenceBakalariLessonJSON, AnyBakalariLessonJSON, NormalBakalariLessonJSON, RemovedBakalariLessonJSON } from "@/schemas";

/** The type of a bakalari lesson */
export enum BakalariLessonType {
    /** Normal lesson */
    Normal = "atom",

    /** Canceled / removed lesson */
    Removed = "removed",

    /** Absence / Event */
    Absence = "absent"
}

export enum BakalariAbsenceType {
    /* Absence studenta */
    Absent = "_Absent",

    /* Omluvená absence */
    Ok = "_AbsentOk",

    /* Neomluvená absence */
    Miss = "_AbsentMiss",

    /* Pozdní příchod */
    Late = "_AbsentLate",

    /* Nezapočtená absence */
    School = "_AbsentSchool",

    /* Brzký odchod */
    Soon = "_AbsentSoon"
}

/** Any Bakalari lesson */
export type AnyBakalariLesson = NormalBakalariLesson | RemovedBakalariLesson | AbsenceBakalariLesson;

/** A lesson in the schedule (abstract) */
export abstract class BaseBakalariLesson {
    /** The type of the lesson */
    abstract readonly type: BakalariLessonType;

    constructor(
        /** Change info description */
        readonly change: string | null = null
    ) {}

    /** Deserialize the lesson from JSON */
    static fromJSON(json: AnyBakalariLessonJSON, handler: DetailHandler): AnyBakalariLesson {
        switch (json.type) {
            case BakalariLessonType.Normal:
                return NormalBakalariLesson.fromJSON(json as NormalBakalariLessonJSON, handler);
            case BakalariLessonType.Removed:
                return RemovedBakalariLesson.fromJSON(json as RemovedBakalariLessonJSON);
            case BakalariLessonType.Absence:
                return AbsenceBakalariLesson.fromJSON(json as AbsenceBakalariLessonJSON);
            default:
                throw new Error(`Unknown lesson type: ${(json as AnyBakalariLessonJSON).type}`);
        }
    }

    /** Patch a public schedule lesson (this) with a auth schedule lesson (other) */
    patch(other: BaseBakalariLesson): this {
        if (this.type !== other.type) throw new Error(`Can't patch lessons of different types: ${this.type} and ${other.type}`);

        return this;
    }

    // Type guards

    /** Check if the lesson is normal */
    isNormal(): this is NormalBakalariLesson {
        return this.type === BakalariLessonType.Normal;
    }

    /** Check if the lesson was removed */
    isRemoved(): this is RemovedBakalariLesson {
        return this.type === BakalariLessonType.Removed;
    }

    /** Check if the class is absent */
    isAbsence(): this is AbsenceBakalariLesson {
        return this.type === BakalariLessonType.Absence;
    }
}

/** A normal lesson */
export class NormalBakalariLesson extends BaseBakalariLesson {
    readonly type = BakalariLessonType.Normal;

    constructor(
        /** Information about the subject */
        readonly subject: Detail | null,

        /** Information about the teacher */
        readonly teacher: TeacherDetail | null,

        /** The room the lesson is taught in */
        readonly room: Detail | null,

        /** The groups the lesson targets */
        readonly groups: Group[],

        /** The topic (or theme. idk). will be null if the teacher din't write anything */
        readonly topic: string | null = null,

        /** Absence info */
        public absence: BakalariAbsenceType | null = null,

        /** Homework */
        public homework: string[] = [],

        change: string | null = null
    ) {
        super(change);
    }

    patch(other: BaseBakalariLesson): this {
        super.patch(other);

        // Check if the other lesson is normal
        if (!other.isNormal()) throw new Error(`Can't patch a normal lesson with a ${other.type} lesson`);

        // Verify that the details are the same
        if (this.subject?.id !== other.subject?.id || this.teacher?.id !== other.teacher?.id || this.room?.id !== other.room?.id)
            throw new Error(`Can't patch a lesson with different details`);

        // Verify that the groups are the same (the other can only have one group)
        if (this.groups.length > 0 && !this.groups.some((g) => g.number === other.groups[0]?.number))
            throw new Error(`Can't patch a lesson with different groups`);

        // Patch absence and homework (since those are the only additional fields in the auth schedule)
        this.absence = other.absence;
        this.homework = other.homework;

        return this;
    }

    /** Serialize the lesson to JSON */
    toJSON(): NormalBakalariLessonJSON {
        return {
            ...this,
            subject: this.subject?.toString() ?? null,
            teacher: this.teacher?.toString() ?? null,
            room: this.room?.toString() ?? null,
            groups: this.groups.map((group) => ({ number: group.number, class: group.class?.toString() ?? null }))
        };
    }

    static fromJSON(json: NormalBakalariLessonJSON, handler: DetailHandler) {
        // Get the details
        const subject = json.subject ? handler.getOne(json.subject) : null;
        const teacher = json.teacher ? handler.getOne<TeacherDetail>(json.teacher) : null;
        const room = json.room ? handler.getOne(json.room) : null;

        const groups = json.groups.map((group) => Group.fromJSON(group, handler));

        return new NormalBakalariLesson(subject, teacher, room, groups, json.topic, json.absence, json.homework, json.change);
    }
}

/** A removed lesson */
export class RemovedBakalariLesson extends BaseBakalariLesson {
    readonly type = BakalariLessonType.Removed;

    get title() {
        return this.change;
    }

    constructor(readonly change: string) {
        super();
    }

    static fromJSON(object: RemovedBakalariLessonJSON) {
        return new RemovedBakalariLesson(object.change);
    }
}

/** Lesson absence */
export class AbsenceBakalariLesson extends BaseBakalariLesson {
    override readonly type = BakalariLessonType.Absence;

    constructor(
        /** Absence info ig?, irl it's just "Absc" */
        readonly info: string,

        /** The name of the absence */
        readonly name: string | null,

        change: string | null = null
    ) {
        super(change);
    }

    static fromJSON(object: AbsenceBakalariLessonJSON) {
        return new AbsenceBakalariLesson(object.info, object.name ?? null, object.change);
    }
}
