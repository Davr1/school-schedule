import type { Detail } from "@/classes";

export class User {
    /** The user's name */
    name: string;

    /** The user's class */
    class: Detail;

    constructor(name: string, classDetail: Detail) {
        this.name = name;
        this.class = classDetail;
    }
}
