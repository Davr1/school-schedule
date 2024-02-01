import { Detail, DetailType, TeacherDetail } from "@/classes/details/details";
import { classes, rooms, teachers } from "@/classes/details/static";

/** An error thrown when a detail is not found */
class DetailNotFoundError extends TypeError {
    constructor(param: string, value: string) {
        super(`Detail with for parameter ${param} with value ${value} was not found`);
    }
}

export class DetailHandler extends Map<string, Detail> {
    constructor() {
        super();

        // Add default details
        for (const detail of [...classes, ...teachers, ...rooms]) {
            this.set(detail.id, detail);
        }
    }

    /**
     * All details in this handler.
     */
    get details(): Detail[] {
        return Array.from(this.values());
    }

    /**
     * Get all details of a given type.
     * @param type Detail type.
     * @returns Details of the given type.
     */
    getOfType<T extends Detail = Detail>(type: DetailType): T[] {
        return this.details.filter((detail) => detail.type === type) as T[];
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
        let detail = super.get(id);

        // If the detail doesn't exist, add the default detail
        if (!detail && defaultDetail) detail = this.#addDefaultDetail(defaultDetail);

        return detail as T;
    }

    /** Get exactly one detail by its id. Throws an error if not found. */
    getOne<T extends Detail = Detail>(id: string): T {
        const detail = this.get<T>(id);

        if (!detail) throw new DetailNotFoundError("id", id);
        return detail;
    }

    /**
     * Get a detail by its name.
     * @param name The name to search for.
     * @param defaultDetail A default detail (or callback) to add and return if the detail doesn't exist.
     * @returns Detail with the given name or `undefined` if not found.
     */
    getByName<T extends Detail = Detail>(name: string): T | undefined;
    getByName<T extends Detail = Detail>(name: string, defaultDetail: T | (() => T)): T;
    getByName<T extends Detail = Detail>(name: string, defaultDetail?: T | (() => T)): T | undefined {
        let detail = this.details.find((detail) => detail.name === name || (detail instanceof TeacherDetail && detail.fullName === name));

        // If the detail doesn't exist, add the default detail
        if (!detail && defaultDetail) detail = this.#addDefaultDetail(defaultDetail);

        return detail as T;
    }

    /** Get exactly one detail by its name. Throws an error if not found. */
    getOneByName<T extends Detail = Detail>(name: string): T {
        const detail = this.getByName<T>(name);

        if (!detail) throw new DetailNotFoundError("name", name);
        return detail;
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
        let detail = this.details.find((detail) => {
            if (detail instanceof TeacherDetail) {
                return detail.abbreviation === abbreviation;
            } else if (detail instanceof Detail && detail.type === DetailType.Subject) {
                return detail.id === abbreviation;
            }

            return false;
        });

        // If the detail doesn't exist, add the default detail
        if (!detail && defaultDetail) detail = this.#addDefaultDetail(defaultDetail);

        return detail as T;
    }

    /** Get exactly one detail by its abbreviation. Throws an error if not found. */
    getOneByAbbreviation<T extends Detail = Detail>(abbreviation: string): T {
        const detail = this.getByAbbreviation<T>(abbreviation);

        if (!detail) throw new DetailNotFoundError("abbreviation", abbreviation);
        return detail;
    }

    /** @private Get default detail helper */
    #addDefaultDetail(d: Detail | (() => Detail)) {
        const detail = typeof d === "function" ? d.call(undefined) : d;

        this.set(detail.id, detail);
        return detail;
    }
}
