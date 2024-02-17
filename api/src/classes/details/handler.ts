import { Detail, DetailType, TeacherDetail } from "@/classes/details/details";
import { classes, rooms, subjects, teachers } from "@/classes/details/static";

/** An error thrown when a detail is not found */
class DetailNotFoundError extends TypeError {
    constructor(param: string, value: string) {
        super(`Detail with for parameter ${param} with value ${value} was not found`);
    }
}

export class DetailHandler extends Map<string, Detail> {
    static #instance: DetailHandler | undefined;

    /** Get the singleton instance of this class, you can still create new instances if you want (but they won't include the default details) */
    static get instance() {
        // If the instance doesn't exist, create a new one with the default details
        if (!this.#instance) {
            this.#instance = new DetailHandler();

            // Add the default details
            for (const collection of [teachers, rooms, classes, subjects])
                for (const detail of Object.values(collection)) this.#instance.add(detail);
        }

        return this.#instance;
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
     * @returns Detail with the given id or `undefined` if not found.
     */
    get<T extends Detail = Detail>(id: string): T | undefined {
        return super.get(id) as T;
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
     * @returns Detail with the given name or `undefined` if not found.
     */
    getByName<T extends Detail = Detail>(name: string): T | undefined {
        let detail = this.details.find((detail) => detail.name === name);

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
     * @returns Detail with the given abbreviation or `undefined` if not found.
     */
    getByAbbreviation<T extends Detail = Detail>(abbreviation: string): T | undefined {
        let detail = this.details.find((detail) => {
            if (detail instanceof TeacherDetail) {
                return detail.abbreviation === abbreviation;
            } else if (detail.type === DetailType.Subject) {
                return detail.id === abbreviation;
            }

            return false;
        });

        return detail as T;
    }

    /** Get exactly one detail by its abbreviation. Throws an error if not found. */
    getOneByAbbreviation<T extends Detail = Detail>(abbreviation: string): T {
        const detail = this.getByAbbreviation<T>(abbreviation);

        if (!detail) throw new DetailNotFoundError("abbreviation", abbreviation);
        return detail;
    }

    /** Get a detail by checking if it's a match (includes id, name, and other properties) */
    getByMatch<T extends Detail = Detail>(str: string): T | undefined {
        return this.details.find((detail) => detail.matches(str)) as T;
    }

    /** Get exactly one detail by checking if it's a match. Throws an error if not found. */
    getOneByMatch<T extends Detail = Detail>(str: string): T {
        const detail = this.getByMatch<T>(str);

        if (!detail) throw new DetailNotFoundError("match", str);
        return detail;
    }

    /**
     * Add a detail to this handler
     *
     * If the detail already exists, the old detail will be returned
     * @param detail The detail to add
     */
    add<T extends Detail = Detail>(detail: T): T {
        if (this.has(detail.id)) return this.getOne<T>(detail.id);

        this.set(detail.id, detail);
        return detail;
    }

    /**
     * Delete a detail from this handler
     */
    delete(detail: string | Detail): boolean {
        if (detail instanceof Detail) detail = detail.id;

        return super.delete(detail);
    }
}
