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
        return this.id.toString();
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

export class DetailHandler {
    private _details: Detail[] = [];

    /**
     * All details in this handler.
     */
    get details(): Detail[] {
        return [...this._details];
    }

    /**
     * Get a detail by its id.
     * @param id Detail id.
     * @param defaultDetail A default detail (or callback) to add and return if the detail doesn't exist.
     * @returns Detail with the given id or `undefined` if not found.
     */
    get<T extends Detail = Detail>(id: string): T | undefined;
    get<T extends Detail = Detail>(id: string, defaultDetail: T | (() => T)): T;
    get<T extends Detail = Detail>(id: string, defaultDetail?: T | (() => T)): T | undefined {
        let detail = this._details.find((detail) => detail.id === id);

        // If the detail doesn't exist, add the default detail
        if (!detail && defaultDetail) detail = this.addDefaultDetail(defaultDetail);

        return detail as T;
    }

    getByName<T extends Detail = Detail>(name: string): T | undefined;
    getByName<T extends Detail = Detail>(name: string, defaultDetail: T | (() => T)): T;
    getByName<T extends Detail = Detail>(name: string, defaultDetail?: T | (() => T)): T | undefined {
        let detail = this._details.find((detail) => detail.name === name);

        // If the detail doesn't exist, add the default detail
        if (!detail && defaultDetail) detail = this.addDefaultDetail(defaultDetail);

        return detail as T;
    }

    /**
     * Get a detail by its abbreviation.
     * @param abbreviation Detail abbreviation.
     * @param defaultDetail A default detail (or callback) to add and return if the detail doesn't exist.
     * @returns Detail with the given abbreviation or `undefined` if not found.
     */
    getByAbbreviation<T extends Detail = Detail>(abbreviation: string): T | undefined;
    getByAbbreviation<T extends Detail = Detail>(abbreviation: string, defaultDetail: T | (() => T)): T;
    getByAbbreviation<T extends Detail = Detail>(abbreviation: string, defaultDetail?: T | (() => T)): T | undefined {
        let detail = this._details.find((detail) => {
            if (detail instanceof TeacherDetail) {
                return detail.abbreviation === abbreviation;
            } else if (detail instanceof Detail && detail.type === DetailType.Subject) {
                return detail.id === abbreviation;
            }

            return false;
        });

        // If the detail doesn't exist, add the default detail
        if (!detail && defaultDetail) detail = this.addDefaultDetail(defaultDetail);

        return detail as T;
    }

    /**
     * Add a detail to this handler.
     * @param detail Detail to add.
     */
    add(...details: Detail[]) {
        this._details.push(...details);
    }

    /** @private Get default detail helper */
    private addDefaultDetail(d: Detail | (() => Detail)) {
        const detail = typeof d === "function" ? d.call(undefined) : d;

        this.add(detail);
        return detail;
    }
}
