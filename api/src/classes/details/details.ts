import type { DetailHandler } from "@/classes/details/handler";
import type { AnyDetailJSON, ClassDetailJSON, TeacherDetailJSON } from "@/schemas/details";

/** The type of a detail */
export enum DetailType {
    Class = "Class",
    Teacher = "Teacher",
    Subject = "Subject",
    Room = "Room"
}

/** Any detail instance */
export type AnyDetail = Detail | ClassDetail | TeacherDetail;

export class Detail {
    /**
     * Is the detail static
     */
    static = false;

    constructor(
        readonly type: DetailType,
        public id: string,
        public name: string | null
    ) {}

    /** Check if the given string matches this detail */
    matches(str: string): boolean {
        str = str.toLowerCase();

        return this.id.toLowerCase() === str || (this.name !== null && this.name.toLowerCase() === str);
    }

    /** Return the id of the detail when converted to a string */
    toString() {
        return this.id;
    }

    /** Serialize the detail to JSON */
    toJSON(): AnyDetailJSON {
        return {
            type: this.type as DetailType.Subject | DetailType.Room,
            id: this.id,
            name: this.name
        };
    }

    /** Deserialize the detail from JSON */
    static fromJSON(json: AnyDetailJSON, details?: DetailHandler): AnyDetail {
        if (json.type === DetailType.Teacher) return TeacherDetail.fromJSON(json);
        if (json.type === DetailType.Class) return ClassDetail.fromJSON(json, details);

        return new Detail(json.type, json.id, json.name ?? null);
    }
}

export class ClassDetail extends Detail {
    readonly type = DetailType.Class;

    constructor(
        id: string,
        public name: string,
        public teacher: TeacherDetail | null = null,
        public room: Detail | null = null
    ) {
        super(DetailType.Class, id, name);
    }

    matches(str: string): boolean {
        if (super.matches(str)) return true;

        // Replace dots with nothing and compare the strings
        str = str.replace(/\./g, "").toLowerCase();
        const name = this.name.replace(/\./g, "").toLowerCase();

        // And also check for the name without the first character
        return name === str || name.slice(1) === str;
    }

    toJSON(): ClassDetailJSON {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            teacher: this.teacher?.toString() ?? null,
            room: this.room?.toString() ?? null
        };
    }

    static fromJSON(json: ClassDetailJSON, details?: DetailHandler) {
        return new ClassDetail(
            json.id,
            json.name,
            json.teacher && details ? details.getOne<TeacherDetail>(json.teacher) : null,
            json.room && details ? details.getOne(json.room) : null
        );
    }
}

export class TeacherDetail extends Detail {
    readonly type = DetailType.Teacher;

    get fullName() {
        const prefix = this.prefix && this.prefix + ".";
        const suffix = this.suffix && this.suffix + ".";

        // Use the first and last name if available, otherwise use the "name" (which is normally the login name)
        const name = this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : this.name;

        return `${prefix ?? ""} ${name} ${suffix ?? ""}`.trim();
    }

    get reverseName() {
        return `${this.lastName ?? ""} ${this.firstName ?? ""}`.trim();
    }

    constructor(
        id: string,
        public abbreviation: string,
        public name: string, // Login name
        public firstName: string | null = null,
        public lastName: string | null = null,
        public prefix: string | null = null,
        public suffix: string | null = null
    ) {
        super(DetailType.Teacher, id, name);
    }

    matches(name: string) {
        if (super.matches(name)) return true;

        if (!this.firstName && !this.lastName) return false;

        const prefix = this.prefix && this.prefix + ".";
        const suffix = this.suffix && this.suffix + ".";

        const baseVariants = [this.name];
        if (this.lastName) baseVariants.push(this.lastName);
        if (this.firstName && this.lastName) baseVariants.push(`${this.firstName} ${this.lastName}`, `${this.lastName} ${this.firstName}`);

        const variants = [...baseVariants];
        if (prefix) variants.push(...baseVariants.map((name) => `${prefix} ${name}`));
        if (suffix) variants.push(...baseVariants.map((name) => `${name} ${suffix}`));
        if (prefix && suffix) variants.push(...baseVariants.map((name) => `${prefix} ${name} ${suffix}`));

        return variants.some((variant) => variant.toLowerCase() === name.toLowerCase());
    }

    toJSON(): TeacherDetailJSON {
        return {
            type: this.type,
            id: this.id,
            abbreviation: this.abbreviation,
            name: this.name,
            firstName: this.firstName ?? null,
            lastName: this.lastName ?? null,
            prefix: this.prefix ?? null,
            suffix: this.suffix ?? null
        };
    }

    static fromJSON(json: TeacherDetailJSON) {
        return new TeacherDetail(
            json.id,
            json.abbreviation,
            json.name,
            json.firstName ?? null,
            json.lastName ?? null,
            json.prefix ?? null,
            json.suffix ?? null
        );
    }
}
