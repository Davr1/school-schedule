import { classes, rooms, teachers } from "@school-schedule/api/classes";

export function match(name) {
    return [...teachers, ...classes, ...rooms].some((item) => {
        return item.name === name;
    });
}
