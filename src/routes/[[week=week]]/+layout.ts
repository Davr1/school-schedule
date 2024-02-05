import { redirect } from "@sveltejs/kit";

import { Week } from "@/loader/bakalari";

/** Parse the week from the params */
export function load({ params: { week }, url }) {
    // Update the week to be the first letter uppercase and the rest lowercase
    if (week) week = week[0].toUpperCase() + week.slice(1).toLowerCase();

    // If "Current" (or "Actual", as bakalari calls it...) was explicitly requested,
    // redirect to the same page without the week, cuz its's the default.
    if (week === "Current" || week === "Actual") return redirect(301, url.pathname.replace(new RegExp(`^/${week}`, "i"), ""));

    // Parse the week
    return {
        week: Week[week as keyof typeof Week] ?? Week.Current
    };
}
