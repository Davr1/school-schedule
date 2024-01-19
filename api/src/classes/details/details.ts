import type { AnyDetailJSON, TeacherDetailJSON } from "@/schemas";

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

    // In the future, more details may be added here

    constructor(
        id: string,
        name: string | null,
        readonly abbreviation: string
    ) {
        super(DetailType.Teacher, id, name);
    }

    static fromJSON(json: TeacherDetailJSON) {
        return new TeacherDetail(json.id, json.name ?? null, json.abbreviation);
    }
}
