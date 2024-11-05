import { error } from "@sveltejs/kit";

export function load() {
    error(410, "Gone");
}
