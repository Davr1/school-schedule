import { DetailHandler } from "@school-schedule/api/classes";
import { error, redirect } from "@sveltejs/kit";

/** Handle aliases for details */
export function GET({ params: { detail, week } }) {
    // When the user explicitly requests the "current" week, redirect to the same page without the week
    week = week?.toLowerCase();
    if (week === "current" || week === "actual") week = undefined;

    const item = DetailHandler.instance.getByMatch(detail);
    if (item?.name) redirect(301, `${week ? `/${week}` : ""}/${encodeURIComponent(item.name)}`);

    error(404, "Schedule not found");
}
