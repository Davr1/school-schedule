import type { ObjectId } from "bson";

export type IdType = number | string | ObjectId;

export class Details {
    constructor(public id: IdType) {}

    toJSON() {
        return this.id;
    }

    toBSON() {
        return this.id;
    }
}

export class TeacherDetails extends Details {
    // In the future, more details may be added here

    constructor(
        id: IdType,
        public name: string | null,
        readonly abbreviation: string
    ) {
        super(id);
    }
}

export class SubjectDetails extends Details {
    constructor(
        id: IdType,
        public name: string | null,
        readonly abbreviation: string
    ) {
        super(id);
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
    getDetail<T extends Details = Details>(id: IdType, defaultDetail: T | (() => T)): T;
    getDetail<T extends Details = Details>(id: IdType, defaultDetail?: T | (() => T)): T | undefined {
        const detail = this._details.find((detail) => detail.id === id);

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
    getDetailByAbbreviation<T extends Details = Details>(abbreviation: string, defaultDetail: T | (() => T)): T;
    getDetailByAbbreviation<T extends Details = Details>(abbreviation: string, defaultDetail?: T | (() => T)): T | undefined {
        const detail = this._details.find((detail) => {
            if (detail instanceof TeacherDetails || detail instanceof SubjectDetails) {
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
