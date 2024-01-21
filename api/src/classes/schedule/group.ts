import type { Detail, DetailHandler } from "@/classes/details";
import type { GroupJSON } from "@/schemas/group";

/** Class group */
export class Group {
    /** The class, null if the schedule type is class */
    public class: Detail | null;

    /** The group number, null if the whole class is targetted */
    public number: number | null;

    get name() {
        return `${this.class?.name ?? ""} ${this.number !== null ? ` ${this.number}.sk` : ""}`.trim();
    }

    constructor(className: Detail | null = null, number: number | null = null) {
        this.class = className;
        this.number = number;
    }

    toJSON(): GroupJSON {
        return {
            class: this.class?.toString() ?? null,
            number: this.number
        };
    }

    static fromJSON(json: GroupJSON, handler: DetailHandler) {
        return new Group(json.class ? handler.getOne(json.class) : null, json.number ?? null);
    }

    /** Determine the display name of multiple groups */
    static name(group: Group): string;
    static name(groups: Group[]): string;
    static name(...groups: Group[]): string;
    static name(...all: Group[] | Group[][]): string {
        const groups = all.flat();

        if (groups.length === 0) return "";
        else if (groups.length === 1) return groups[0].name;
        else if (groups.length > 2 && groups[0].number !== null && groups.every((g) => g.number === groups[0].number))
            return `${groups[0].number}.sk`;
        else if (groups.length > 4) return `${groups.length} skupin`;
        else return groups.map((group) => group.name).join(", ");
    }
}
