import { DetailHandler } from "@school-schedule/api/classes";

export function match(name) {
    return Boolean(DetailHandler.instance.getByName(name));
}
