import type { Detail, DetailHandler, TeacherDetail } from "@/classes/details";
import type { AbsenceLessonJSON, AnyBakalariLessonJSON, GroupJSON, NormalLessonJSON, RemovedLessonJSON } from "@/schemas";

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
export type AnyBakalariLesson = NormalLesson | RemovedLesson | AbsenceLesson;

/** A lesson in the schedule (abstract) */
export abstract class BakalariLesson {
    /** The type of the lesson */
    abstract readonly type: BakalariLessonType;

    abstract get title(): string;

    constructor(
        /** Change info description */
        readonly change: string | null = null
    ) {}

    /** Deserialize the lesson from JSON */
    static fromJSON(json: AnyBakalariLessonJSON, handler: DetailHandler): AnyBakalariLesson {
        switch (json.type) {
            case BakalariLessonType.Normal:
                return NormalLesson.fromJSON(json as NormalLessonJSON, handler);
            case BakalariLessonType.Removed:
                return RemovedLesson.fromJSON(json as RemovedLessonJSON);
            case BakalariLessonType.Absence:
                return AbsenceLesson.fromJSON(json as AbsenceLessonJSON);
            default:
                throw new Error(`Unknown lesson type: ${(json as AnyBakalariLessonJSON).type}`);
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

/** Class group */
export class Group {
    /** The class, null if the schedule type is class */
    public class: Detail | null;

    /** The group number, null if the whole class is targetted */
    public number: number | null;

    get name() {
        return `${this.class?.name ?? ""} ${this.number !== null ? ` ${this.number}.sk` : ""}`.trim();
    }

    constructor(className: Detail | null = null, number: number | null = null) {
        this.class = className;
        this.number = number;
    }

    toJSON(): GroupJSON {
        return {
            class: this.class?.toString() ?? null,
            number: this.number
        };
    }

    static fromJSON(json: GroupJSON, handler: DetailHandler) {
        return new Group(json.class ? handler.getOne(json.class) : null, json.number ?? null);
    }
}

/** A normal lesson */
export class NormalLesson extends BakalariLesson {
    readonly type = BakalariLessonType.Normal;

    get title() {
        return `
            ${this.topic ?? ""}

            ${this.subject?.name ?? "..."}
            ${this.teacher?.name ?? ""}
            ${this.room.name}
        `
            .split("\n")
            .map((line) => line.trim())
            .join("\n")
            .trim();
    }

    get split(): boolean {
        // Class schedules
        return this.groups.some((group) => group.number !== null);
    }

    get hasIdenticalGroups(): boolean {
        // It would be weird to do this when there's just 2 groups (or less)
        if (this.groups.length <= 2) return false;

        // This also shouldn't be done if the group numbers are null
        if (this.groups[0].number === null) return false;

        return this.groups.every((group) => group.number === this.groups[0].number);
    }

    constructor(
        /** Information about the subject */
        readonly subject: Detail | null,

        /** Information about the teacher */
        readonly teacher: TeacherDetail | null,

        /** The room the lesson is taught in */
        readonly room: Detail,

        /** The groups the lesson targets */
        readonly groups: Group[],

        /** The topic (or theme. idk). will be null if the teacher din't write anything */
        readonly topic: string | null = null,

        change: string | null = null
    ) {
        super(change);
    }

    /** Serialize the lesson to JSON */
    toJSON(): NormalLessonJSON {
        return {
            ...this,
            subject: this.subject?.toString() ?? null,
            teacher: this.teacher?.toString() ?? null,
            room: this.room.toString(),
            groups: this.groups.map((group) => ({ number: group.number, class: group.class?.toString() ?? null }))
        };
    }

    static fromJSON(json: NormalLessonJSON, handler: DetailHandler) {
        // Get the details
        const subject = json.subject ? handler.getOne(json.subject) : null;
        const teacher = json.teacher ? handler.getOne<TeacherDetail>(json.teacher) : null;
        const room = handler.getOne(json.room);

        const groups = json.groups.map((group) => Group.fromJSON(group, handler));

        return new NormalLesson(subject, teacher, room, groups, json.topic, json.change);
    }
}

/** A removed lesson */
export class RemovedLesson extends BakalariLesson {
    readonly type = BakalariLessonType.Removed;

    get title() {
        return this.change;
    }

    constructor(readonly change: string) {
        super();
    }

    static fromJSON(object: RemovedLessonJSON) {
        return new RemovedLesson(object.change);
    }
}

/** Lesson absence */
export class AbsenceLesson extends BakalariLesson {
    override readonly type = BakalariLessonType.Absence;

    get title() {
        return this.name ?? this.info;
    }

    constructor(
        /** Absence info ig?, irl it's just "Absc" */
        readonly info: string,

        /** The name of the absence */
        readonly name: string | null,

        change: string | null = null
    ) {
        super(change);
    }

    static fromJSON(object: AbsenceLessonJSON) {
        return new AbsenceLesson(object.info, object.name ?? null, object.change);
    }
}
