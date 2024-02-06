import { Detail, DetailHandler, Schedule } from "@school-schedule/api/classes";
import type { DetailJSON, ScheduleJSON } from "@school-schedule/api/schemas";
import { error } from "@sveltejs/kit";

export async function load({ fetch, params: { detail }, parent }) {
    // Get the week
    const { week } = await parent();

    // Find the detail
    const item = DetailHandler.instance.getByName(detail) ?? error(404, "Schedule not found");

    const scheduleJSON = await fetch(`https://rozvrh-v3.icy.cx/api/bakalari/${week}/${item}`).then<ScheduleJSON[]>((res) => res.json());

    await fetch("https://rozvrh-v3.icy.cx/api/details/Subject")
        .then<DetailJSON[]>((res) => res.json())
        .then((json) => json.forEach((d) => DetailHandler.instance.add(Detail.fromJSON(d, DetailHandler.instance))));

    const schedule = scheduleJSON.map((s) => Schedule.fromJSON(s, DetailHandler.instance));

    return { schedule, detail: item };
}
