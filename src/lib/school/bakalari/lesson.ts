export const enum LessonType {
    /** Normal lesson */
    Normal,

    /** Canceled / removed lesson */
    Removed,

    /**
     * Class absence (not a full day event tho)
     *
     * Not too sure what this exactly is, it's not uncommon tho
     */
    Absence
}

/** A lesson in the schedule (abstract) */
export abstract class Lesson {
    /** The type of the lesson */
    abstract readonly type: LessonType;

    /** Info about a possible change, null if there is no change */
    readonly change: string | null;

    constructor(change: string | null) {
        this.change = change;
    }

    // Type guards (aka type predicates. basically just a function that returns a boolean and narrows the type)
    // See: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

    /** Check if the lesson is normal */
    isNormal(): this is NormalLesson {
        return this.type === LessonType.Normal;
    }

    /** Check if the lesson was removed */
    isRemoved(): this is RemovedLesson {
        return this.type === LessonType.Removed;
    }

    /** Check if the class is absent */
    isAbsence(): this is AbsenceLesson {
        return this.type === LessonType.Absence;
    }
}

export interface Info {
    name: string | null;
    abbreviation: string | null;
}

export interface Group {
    /** The group number, null if the whole class is targetted */
    number: number | null;

    /** The class name, null if the schedule type is class */
    class: string | null;
}

/** A normal lesson */
export class NormalLesson extends Lesson {
    readonly type = LessonType.Normal;

    /** The subject info */
    readonly subject: Info;

    /** The teacher */
    readonly teacher: Info;

    /** The room the lesson is taught in */
    readonly room: string;

    /** The groups the lesson targets */
    readonly groups: Group[];

    /** The topic (or theme. idk). will be null if the teacher din't write anything */
    readonly topic: string | null;

    constructor(subject: Info, teacher: Info, room: string, groups: Group[], topic: string | null, change: string | null) {
        super(change);

        this.subject = subject;
        this.teacher = teacher;
        this.room = room;
        this.topic = topic;
        this.groups = groups;
    }
}

/** A removed lesson */
export class RemovedLesson extends Lesson {
    readonly type = LessonType.Removed;

    /** Info about the removal */
    declare readonly change: string;

    constructor(change: string) {
        super(change);
    }
}

/** A class absence */
export class AbsenceLesson extends Lesson {
    readonly type = LessonType.Absence;

    /** Info about the change */
    declare readonly change: string;

    /** Info about the absence */
    readonly absence: Info;

    constructor(absence: Info, change: string) {
        super(change);

        this.absence = absence;
    }
}
