import type { AnyDetailJSON, TeacherDetailJSON } from "@/schemas/details";

/** The type of a detail */
export enum DetailType {
    Class = "Class",
    Teacher = "Teacher",
    Subject = "Subject",
    Room = "Room"
}

/** Any detail instance */
export type AnyDetail = Detail | TeacherDetail;

export class Detail {
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

    /** Deserialize the detail from JSON */
    static fromJSON(json: AnyDetailJSON): AnyDetail {
        if (json.type === DetailType.Teacher) return TeacherDetail.fromJSON(json as TeacherDetailJSON);

        return new Detail(json.type, json.id, json.name ?? null);
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
        name: string | null, // Login name
        public firstName: string | null = null,
        public lastName: string | null = null,
        public prefix: string | null = null,
        public suffix: string | null = null
    ) {
        super(DetailType.Teacher, id, name);
    }

    matches(name: string) {
        if (super.matches(name)) return true;

        if (!this.name && !this.firstName && !this.lastName) return false;

        const prefix = this.prefix && this.prefix + ".";
        const suffix = this.suffix && this.suffix + ".";

        const baseVariants = [];
        if (this.name) baseVariants.push(this.name);
        if (this.lastName) baseVariants.push(this.lastName);
        if (this.firstName && this.lastName) baseVariants.push(`${this.firstName} ${this.lastName}`, `${this.lastName} ${this.firstName}`);

        const variants = [...baseVariants];
        if (prefix) variants.push(...baseVariants.map((name) => `${prefix} ${name}`));
        if (suffix) variants.push(...baseVariants.map((name) => `${name} ${suffix}`));
        if (prefix && suffix) variants.push(...baseVariants.map((name) => `${prefix} ${name} ${suffix}`));

        return variants.some((variant) => variant.toLowerCase() === name.toLowerCase());
    }

    static fromJSON(json: TeacherDetailJSON) {
        return new TeacherDetail(
            json.id,
            json.abbreviation,
            json.name ?? null,
            json.firstName ?? null,
            json.lastName ?? null,
            json.prefix ?? null,
            json.suffix ?? null
        );
    }
}
