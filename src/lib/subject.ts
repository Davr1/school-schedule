export enum SubjectType {
    Empty = 0,
    Standard = 1,
    Special = 2
}

export interface SubjectProps {
    change: boolean;
}

/** A subject in the schedule (abstract) */
export abstract class Subject {
    /** The type of the subject */
    abstract readonly type: SubjectType;

    /** Id of the subject, used internally */
    readonly id = Symbol();

    /** Whether there is a change in the schedule or not */
    readonly change: boolean;

    constructor({ change }: Partial<SubjectProps>) {
        this.change = change ?? false;
    }

    // Type guards (aka type predicates. basically just a function that returns a boolean and narrows the type)
    // See: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

    /** Check if the subject is empty */
    isEmpty(): this is EmptySubject {
        return this.type === SubjectType.Empty;
    }

    /** Check if the subject is standard */
    isStandard(): this is StandardSubject {
        return this.type === SubjectType.Standard;
    }

    /** Check if the subject is special */
    isSpecial(): this is SpecialSubject {
        return this.type === SubjectType.Special;
    }
}

/** An empty subject */
export class EmptySubject extends Subject {
    readonly type = SubjectType.Empty as const;
}

// Using Required<> to make sure that the properties are not optional
// This is because normally there are no special subjects... (obviously)
export interface SpecialSubjectProps extends Required<SubjectProps> {
    special: string;
    specialAbbr: string;
    change: true;
}

/**
 * A special subject. Whatever that may be
 *
 * Note: This is only parsed from Bakalari and not from the school's website
 */
export class SpecialSubject extends Subject {
    readonly type = SubjectType.Special as const;

    /** The special subject's name */
    readonly name: string;

    /** The special subject's abbreviation */
    readonly abbreviation: string;

    constructor({ special, specialAbbr, ...params }: Partial<SpecialSubjectProps>) {
        super(params);

        this.name = special ?? "";
        this.abbreviation = specialAbbr ?? "";
    }
}

/** Information about a teacher */
export interface TeacherInfo {
    /** The teacher's name */
    name: string;

    /** The teacher's abbreviation */
    abbreviation: string;
}

export interface StandardSubjectProps extends SubjectProps {
    subject: string;
    abbreviation: string;
    cls: string;
    groups: string[];
    teacher: TeacherInfo;
    room: string;
    theme: string;
}

/** A standard subject */
export class StandardSubject extends Subject {
    readonly type = SubjectType.Standard as const;

    /** The subject's name */
    readonly name: string;

    /** The subject's abbreviation */
    readonly abbreviation: string;

    /**
     * The class the subject is for
     *
     * (Definitely not inspired by React's great naming)
     */
    readonly className: string;

    /** The groups the subject is for */
    readonly groups: string[];

    /** The teacher */
    readonly teacher: TeacherInfo;

    /** The room the subject is taught in */
    readonly room: string;

    /** The theme (or topic. idk). The teachers write this into Bakalari... */
    readonly theme: string;

    constructor(params: Partial<StandardSubjectProps>) {
        super(params);

        this.name = params.subject ?? "";
        this.abbreviation = params.abbreviation ?? "";
        this.className = params.cls ?? "";
        this.groups = params.groups ?? [];
        this.teacher = params.teacher ?? { name: "", abbreviation: "" };
        this.room = params.room ?? "";
        this.theme = params.theme ?? "";
    }
}
