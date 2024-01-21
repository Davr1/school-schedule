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

        change: string | null = null
    ) {
        super(change);
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

        return new NormalBakalariLesson(subject, teacher, room, groups, json.topic, json.change);
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
