import { classes, rooms, teachers } from "@school-schedule/api/classes";
import { redirect } from "@sveltejs/kit";

import { Week } from "@/loader/bakalari";

export function load({ params, url }) {
    // If the week is "current" (or "actual" as bakalari calls it), redirect to the same page without the week
    const weekName = params.week && params.week[0].toUpperCase() + params.week.slice(1).toLowerCase();
    if (weekName === "Current" || weekName === "Actual") {
        return redirect(301, `/${params.detail}` + (url.pathname.endsWith("/merged") ? "/merged" : ""));
    }

    // Get the detail object from the params
    const { detail } = params;

    // Parse the week
    const week = Week[weekName as keyof typeof Week] ?? Week.Current;

    // Find the detail
    for (const item of [...teachers, ...classes, ...rooms]) {
        if (item.name === detail) {
            return {
                detail: item,
                week
            };
        }
    }

    // If the detail is not found, throw cuz it's not possible
    throw new Error("Detail not found");
}
