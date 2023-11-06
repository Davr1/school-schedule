export abstract class Details<T = string> {
    constructor(private _id: T) {}

    /**
     * Detail id
     */
    get id(): T {
        return this._id;
    }

    toJSON() {
        return this._id;
    }

    toBSON() {
        return this._id;
    }
}

export class TeacherDetails<T = string> extends Details<T> {
    // In the future, more details may be added here

    constructor(
        id: T,
        readonly name: string,
        readonly abbreviation: string
    ) {
        super(id);
    }
}

export class SubjectDetails<T = string> extends Details<T> {
    constructor(
        id: T,
        readonly name: string,
        readonly abbreviation: string
    ) {
        super(id);
    }
}

export class DetailHandler<T = string> {
    private _details: Details<T>[] = [];

    /**
     * Add a detail to this handler.
     * @param detail Detail to add.
     */
    addDetail(detail: Details<T>) {
        this._details.push(detail);
    }

    /**
     * All details in this handler.
     */
    get details(): Details<T>[] {
        return [...this._details];
    }

    /**
     * Get a detail by its id.
     * @param id Detail id.
     * @returns Detail with the given id or `undefined` if not found.
     */
    getDetail(id: T): Details<T> | undefined {
        return this._details.find((detail) => detail.id === id);
    }

    /**
     * Get a detail by its abbreviation.
     * @param abbreviation Detail abbreviation.
     * @returns Detail with the given abbreviation or `undefined` if not found.
     * @throws If there are multiple details with the same abbreviation. They should be unique.
     */
    getDetailByAbbreviation(abbreviation: string): Details<T> | undefined {
        const details = this._details.filter((detail) => {
            if (detail instanceof TeacherDetails || detail instanceof SubjectDetails) {
                return detail.abbreviation === abbreviation;
            }

            return false;
        });

        if (details.length > 1) {
            throw new Error(`Multiple details with the abbreviation "${abbreviation}"`);
        }

        return details[0];
    }
}
