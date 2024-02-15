import { type Detail, DetailType } from "@/classes";
import headers from "@/request/headers";

export enum Week {
    Permanent = "Permanent",
    Current = "Actual",
    Next = "Next"
}

export class BakalariRequest extends Request {
    constructor(
        readonly week: Week,
        readonly detail: Detail,
        init?: RequestInit
    ) {
        // Throw an error if the detail type is not supported
        if (detail.type !== DetailType.Class && detail.type !== DetailType.Teacher && detail.type !== DetailType.Room)
            throw new TypeError(`Unsupported schedule type: ${detail.type}`);

        super(`https://is.sssvt.cz/IS/Timetable/Public/${week}/${detail.type}/${detail.id}`, { headers, ...init });
    }
}
