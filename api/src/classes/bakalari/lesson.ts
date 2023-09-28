export const enum LessonType {
    /** Normal lesson */
    Normal = "atom",

    /** Canceled / removed lesson */
    Removed = "removed",

    /** Absence / Event */
    Absence = "absent"
}

/** A lesson in the schedule (abstract) */
export abstract class Lesson {
    /** The type of the lesson */
    abstract readonly type: LessonType;

    // Type guards

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

interface NormalLessonAttributes {
    /** Information about the subject */
    subject: Info;

    /** Information about the teacher */
    teacher: Info;

    /** The room the lesson is taught in */
    room: string;

    /** The groups the lesson targets */
    groups: Group[];

    /** The topic (or theme. idk). will be null if the teacher din't write anything */
    topic: string | null;

    /** Info about a possible change, null if there is no change */
    change: string | null;
}

/** A normal lesson */
export class NormalLesson extends Lesson implements NormalLessonAttributes {
    readonly type = LessonType.Normal;

    // Attributes (JSDoc is located in the interface above)
    readonly subject: Info;
    readonly teacher: Info;
    readonly room: string;
    readonly groups: Group[];
    readonly topic: string | null;
    readonly change: string | null;

    constructor({ subject, teacher, room, groups, topic, change }: NormalLessonAttributes) {
        super();

        this.subject = subject;
        this.teacher = teacher;
        this.room = room;
        this.topic = topic;
        this.groups = groups;
        this.change = change;
    }
}

interface RemovedLessonAttributes {
    /** Info about the lesson that got removed */
    change: string;
}

/** A removed lesson */
export class RemovedLesson extends Lesson implements RemovedLessonAttributes {
    readonly type = LessonType.Removed;

    readonly change: string;

    constructor({ change }: RemovedLessonAttributes) {
        super();

        this.change = change;
    }
}

interface AbsenceLessonAttributes extends RemovedLessonAttributes {
    /** Info about the absence */
    absence: Info;
}

/** Lesson absence */
export class AbsenceLesson extends Lesson implements AbsenceLessonAttributes {
    readonly type = LessonType.Absence;

    readonly change: string;
    readonly absence: Info;

    constructor({ absence, change }: AbsenceLessonAttributes) {
        super();

        this.absence = absence;
        this.change = change;
    }
}
