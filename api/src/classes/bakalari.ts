import type { DetailHandler, Details, TeacherDetails } from "@/classes/details";

/** The type of a bakalari lesson */
export const enum BakalariLessonType {
    /** Normal lesson */
    Normal = "atom",

    /** Canceled / removed lesson */
    Removed = "removed",

    /** Absence / Event */
    Absence = "absent"
}

/** BakalariLesson seralized to JSON */
export type BakalariLessonJSON<T extends BakalariLesson = AnyBakalariLesson> = Omit<
    T,
    "isNormal" | "isRemoved" | "isAbsence" | "subject" | "teacher" | "toJSON"
> &
    (T extends NormalLesson ? { subject: string; teacher: string | null } : {});

/** Any Bakalari lesson */
export type AnyBakalariLesson = NormalLesson | RemovedLesson | AbsenceLesson;

/** A lesson in the schedule (abstract) */
export abstract class BakalariLesson {
    /** The type of the lesson */
    abstract readonly type: BakalariLessonType;

    constructor(
        /** Change info description */
        readonly change: string | null = null
    ) {}

    /** Deserialize the lesson from JSON */
    static fromJSON(json: BakalariLessonJSON, handler: DetailHandler): AnyBakalariLesson {
        switch (json.type) {
            case BakalariLessonType.Normal:
                return NormalLesson.fromJSON(json as BakalariLessonJSON<NormalLesson>, handler);
            case BakalariLessonType.Removed:
                return RemovedLesson.fromJSON(json as BakalariLessonJSON<RemovedLesson>);
            case BakalariLessonType.Absence:
                return AbsenceLesson.fromJSON(json as BakalariLessonJSON<AbsenceLesson>);
            default:
                throw new Error(`Unknown lesson type: ${json.type}`);
        }
    }

    // Type guards

    /** Check if the lesson is normal */
    isNormal(): this is NormalLesson {
        return this.type === BakalariLessonType.Normal;
    }

    /** Check if the lesson was removed */
    isRemoved(): this is RemovedLesson {
        return this.type === BakalariLessonType.Removed;
    }

    /** Check if the class is absent */
    isAbsence(): this is AbsenceLesson {
        return this.type === BakalariLessonType.Absence;
    }
}

export interface Group {
    /** The group number, null if the whole class is targetted */
    number: number | null;

    /** The class name, null if the schedule type is class */
    class: string | null;
}

/** A normal lesson */
export class NormalLesson extends BakalariLesson {
    readonly type = BakalariLessonType.Normal;

    constructor(
        /** Information about the subject */
        readonly subject: Details,

        /** Information about the teacher */
        readonly teacher: TeacherDetails | null,

        /** The room the lesson is taught in */
        readonly room: string,

        /** The groups the lesson targets */
        readonly groups: Group[],

        /** The topic (or theme. idk). will be null if the teacher din't write anything */
        readonly topic: string | null = null,

        change: string | null = null
    ) {
        super(change);
    }

    /** Serialize the lesson to JSON */
    toJSON(): BakalariLessonJSON<NormalLesson> {
        return {
            ...this,
            subject: this.subject.toString(),
            teacher: this.teacher?.toString() ?? null
        };
    }

    static fromJSON(object: BakalariLessonJSON<NormalLesson>, handler: DetailHandler) {
        // Get the subject details
        const subject = handler.getDetail(object.subject);
        const teacher = object.teacher ? handler.getDetail<TeacherDetails>(object.teacher) : null;

        // Check if the details exist
        if (!subject) throw new Error(`Subject with id ${object.subject} not found`);
        if (teacher === undefined) throw new Error(`Teacher with id ${object.teacher} not found`);

        return new NormalLesson(subject, teacher, object.room, object.groups, object.topic, object.change);
    }
}

/** A removed lesson */
export class RemovedLesson extends BakalariLesson {
    readonly type = BakalariLessonType.Removed;

    constructor(readonly change: string) {
        super();
    }

    static fromJSON(object: BakalariLessonJSON<RemovedLesson>) {
        return new RemovedLesson(object.change);
    }
}

/** Lesson absence */
export class AbsenceLesson extends BakalariLesson {
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

    static fromJSON(object: BakalariLessonJSON<AbsenceLesson>) {
        return new AbsenceLesson(object.info, object.name, object.change);
    }
}
