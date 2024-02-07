import { ClassDetail, type DetailHandler } from "@/classes/details";
import type { GroupJSON } from "@/schemas/group";

/** Class group */
export class Group {
    /** The class, null if the schedule type is class */
    public class: ClassDetail | null;

    /** The group number, null if the whole class is targetted */
    public number: number | null;

    get name() {
        return `${this.class?.name ?? ""} ${this.number !== null ? ` ${this.number}.sk` : ""}`.trim();
    }

    constructor(className: ClassDetail | null = null, number: number | null = null) {
        this.class = className;
        this.number = number;
    }

    toJSON(): GroupJSON {
        return {
            class: this.class?.toString() ?? null,
            number: this.number
        };
    }

    equals(group: Group): boolean {
        return this.class === group.class && this.number === group.number;
    }

    static fromJSON(json: GroupJSON, handler: DetailHandler) {
        return new Group(json.class ? handler.getOne<ClassDetail>(json.class) : null, json.number ?? null);
    }

    /** Determine the display name of multiple groups */
    static name(groups: Group[]): string;
    static name(...groups: Group[]): string;
    static name(...all: Group[] | Group[][]): string {
        // Flatten the groups and de-duplicate them
        const groups = all.flat().filter((group, index, array) => array.findIndex((g) => g.equals(group)) === index);

        // Empty array => empty string
        if (groups.length === 0) return "";

        // 1 group => return the name
        if (groups.length === 1) return groups[0].name;

        // Multiple groups with the same number, but different classes => return just the number
        if (groups.length > 2 && groups[0].number !== null && groups.every((g) => g.number === groups[0].number))
            return `${groups[0].number}.sk`;

        // 2 groups with the same class, but make up the entire class => return the class name
        if (
            groups.length === 2 &&
            groups[0].class === groups[1].class &&
            groups.find((g) => g.number === 1 || g.number === 3) &&
            groups.find((g) => g.number === 2 || g.number === 4)
        )
            return groups[0].class?.name ?? "";

        // More than 4 groups => return the amount of groups
        if (groups.length > 4) return `${groups.length} skupin`;

        // Multiple groups => return the names of the groups
        return groups.map((group) => group.name).join(", ");
    }
}
