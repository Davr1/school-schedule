export const enum BakalariLessonType {
    /** Normal lesson */
    Normal = "atom",

    /** Canceled / removed lesson */
    Removed = "removed",

    /** Absence / Event */
    Absence = "absent"
}

/** @private Object of a similar structure to a BakalariLesson */
type BakalariLessonLike<T extends BakalariLesson = BakalariLesson> = Omit<T, "type" | "isNormal" | "isRemoved" | "isAbsence"> & {
    type?: T["type"];
};

/** A lesson in the schedule (abstract) */
export abstract class BakalariLesson {
    /** The type of the lesson */
    abstract readonly type: BakalariLessonType;

    constructor(
        /** Change info description */
        readonly change: string | null = null
    ) {}

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

export interface Info {
    name: string;
    abbreviation: string;
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
        readonly subject: Info,

        /** Information about the teacher */
        readonly teacher: Info | null,

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

    /** Create a new NormalLesson from an object of the same structure */
    static fromObject(object: BakalariLessonLike<NormalLesson>): NormalLesson {
        return new this(object.subject, object.teacher, object.room, object.groups, object.topic, object.change);
    }
}

/** A removed lesson */
export class RemovedLesson extends BakalariLesson {
    readonly type = BakalariLessonType.Removed;

    constructor(readonly change: string) {
        super();
    }

    /** Create a new RemovedLesson from an object of the same structure */
    static fromObject(object: BakalariLessonLike<RemovedLesson>): RemovedLesson {
        return new this(object.change);
    }
}

/** Lesson absence */
export class AbsenceLesson extends BakalariLesson {
    override readonly type = BakalariLessonType.Absence;

    constructor(
        readonly change: string,

        /** Info about the absence */
        readonly absence: Info
    ) {
        super();
    }

    /** Create a new AbsenceLesson from an object of the same structure */
    static fromObject(object: BakalariLessonLike<AbsenceLesson>): AbsenceLesson {
        return new this(object.change, object.absence);
    }
}
