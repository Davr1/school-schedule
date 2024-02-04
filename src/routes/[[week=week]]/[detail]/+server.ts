import { classes, rooms, teachers } from "@school-schedule/api/classes";
import { error, redirect } from "@sveltejs/kit";

/** Handle aliases for details */
export function GET({ params, url }) {
    let { detail, week } = params;
    week = week?.toLowerCase();

    if (week === "current" || week === "actual") week = undefined;

    for (const item of [...teachers, ...classes, ...rooms]) {
        if (item.matches(detail)) {
            redirect(301, (week ? `/${week}` : "") + `/${item.name}` + (url.pathname.endsWith("/merged") ? "/merged" : ""));
        }
    }

    error(404, "Schedule not found");
}
