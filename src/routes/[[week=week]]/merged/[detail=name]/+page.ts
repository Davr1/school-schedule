import { type ClassDetail, DetailHandler, DetailType } from "@school-schedule/api/classes";
import { error } from "@sveltejs/kit";

import { Week } from "@/loader/bakalari";

export async function load({ params: { detail }, parent }) {
    // Get the week
    const { week } = await parent();

    // Permanent schedules aren't supported
    if (week === Week.Permanent) error(400, "Permanent schedules can't be merged");

    // Find the detail
    const item = DetailHandler.instance.getByName<ClassDetail>(detail);
    if (item) {
        if (item.type !== DetailType.Class) return error(400, "Only classes can be merged");

        return {
            detail: item,
            week
        };
    }

    // If the detail is not found, show an error
    error(404, "Schedule not found");
}
