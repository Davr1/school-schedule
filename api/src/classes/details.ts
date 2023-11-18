export type IdType = number | string;

/** The type of a detail */
export enum DetailsType {
    Teacher = "teacher",
    Subject = "subject",

    // Remove this in the future
    Other = "other"
}

/** Details serialized to JSON */
export type DetailsJSON<T extends Details = AnyDetails> = Omit<T, "toJSON" | "toString">;

/** Any details instance */
export type AnyDetails = Details | TeacherDetails;

export class Details {
    constructor(
        readonly type: DetailsType,
        public id: IdType,
        public name: string | null
    ) {}

    /** Return the id of the detail when converted to a string */
    toString() {
        return this.id.toString();
    }

    /** Deserialize the detail from JSON */
    static fromJSON(json: DetailsJSON<Details>) {
        if (json.type === DetailsType.Teacher) return TeacherDetails.fromJSON(json as DetailsJSON<TeacherDetails>);

        return new Details(json.type, json.id, json.name);
    }
}

export class TeacherDetails extends Details {
    readonly type = DetailsType.Teacher;

    // In the future, more details may be added here

    constructor(
        id: IdType,
        name: string | null,
        readonly abbreviation: string
    ) {
        super(DetailsType.Teacher, id, name);
    }

    static fromJSON(json: DetailsJSON<TeacherDetails>) {
        return new TeacherDetails(json.id, json.name, json.abbreviation);
    }
}

export class DetailHandler {
    private _details: Details[] = [];

    /**
     * All details in this handler.
     */
    get details(): Details[] {
        return [...this._details];
    }

    /**
     * Get a detail by its id.
     * @param id Detail id.
     * @param defaultDetail A default detail (or callback) to add and return if the detail doesn't exist.
     * @returns Detail with the given id or `undefined` if not found.
     */
    getDetail<T extends Details = Details>(id: IdType): T | undefined;
    getDetail<T extends Details = Details>(id: IdType, defaultDetail: T | (() => T)): T;
    getDetail<T extends Details = Details>(id: IdType, defaultDetail?: T | (() => T)): T | undefined {
        const detail = this._details.find((detail) => detail.id == id); // == is intentional, id can be a string or number

        if (!detail && defaultDetail) {
            const detail = typeof defaultDetail === "function" ? defaultDetail() : defaultDetail;

            this.addDetail(detail);
            return detail;
        }

        return detail as T;
    }

    /**
     * Get a detail by its abbreviation.
     * @param abbreviation Detail abbreviation.
     * @param defaultDetail A default detail (or callback) to add and return if the detail doesn't exist.
     * @returns Detail with the given abbreviation or `undefined` if not found.
     */
    getDetailByAbbreviation<T extends Details = Details>(abbreviation: string): T | undefined;
    getDetailByAbbreviation<T extends Details = Details>(abbreviation: string, defaultDetail: T | (() => T)): T;
    getDetailByAbbreviation<T extends Details = Details>(abbreviation: string, defaultDetail?: T | (() => T)): T | undefined {
        const detail = this._details.find((detail) => {
            if (detail instanceof TeacherDetails) {
                return detail.abbreviation === abbreviation;
            }

            return false;
        });

        if (!detail && defaultDetail) {
            const detail = typeof defaultDetail === "function" ? defaultDetail() : defaultDetail;

            this.addDetail(detail);
            return detail;
        }

        return detail as T;
    }

    /**
     * Get a new id for a detail.
     * @returns A new id.
     */
    getNewId(): IdType {
        return this._details.length;
    }

    /**
     * Add a detail to this handler.
     * @param detail Detail to add.
     */
    addDetail(detail: Details) {
        this._details.push(detail);
    }
}
