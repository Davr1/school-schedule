import { DetailType } from "@school-schedule/api/classes";
import { error } from "@sveltejs/kit";

import { Week } from "@/loader/bakalari";

export async function load({ parent }) {
    const data = await parent();

    // If the detail isn't a class schedule, show an error
    if (data.detail.type !== DetailType.Class) error(400, "Only class schedules can be merged");

    // Permanent schedules aren't supported either
    if (data.week === Week.Permanent) error(400, "Permanent schedules can't be merged");

    return data;
}
