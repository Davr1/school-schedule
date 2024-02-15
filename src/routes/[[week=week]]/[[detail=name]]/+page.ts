import { Detail, DetailHandler, DetailType, Schedule } from "@school-schedule/api/classes";
import type { DetailJSON, ScheduleJSON } from "@school-schedule/api/schemas";
import { error } from "@sveltejs/kit";

import { browser } from "$app/environment";

export async function load({ fetch, params: { detail }, parent }) {
    // Get the week
    const { week } = await parent();

    // Find the detail
    const item = detail
        ? DetailHandler.instance.getByName(detail) ?? error(404, "Schedule not found")
        : DetailHandler.instance.getOne("UE"); // Default to UE

    if (![DetailType.Class, DetailType.Teacher, DetailType.Room].includes(item.type)) return error(400, "Invalid detail type");

    // On the server, timeout after 3 seconds and instead show a loading screen
    const signal = !browser ? AbortSignal.timeout(3000) : undefined;

    let schedule: Promise<Schedule[] | void> | Schedule[] = fetch(`/api/bakalari/${week}/${item}?minify`, { signal })
        .then<ScheduleJSON[]>(async (res) => res.json())
        .then(async (json) => {
            // Load details that aren't hardcoded
            await fetch("/api/details/Subject?minify")
                .then<DetailJSON[]>((res) => res.json())
                .then((json) => json.forEach((d) => DetailHandler.instance.add(Detail.fromJSON(d, DetailHandler.instance))));

            return json;
        })
        .then((json) => json.map((s) => Schedule.fromJSON(s, DetailHandler.instance)))
        .catch((err) => {
            // If a timeout error occurred, silently ignore it
            if (err instanceof DOMException && err.name === "TimeoutError") return;
            else error(500, "Failed to load schedule");
        });

    // On the server, we want to await the promise, unless it times out, in which case we want to show a loading screen
    if (!browser) schedule = (await schedule) ?? Promise.resolve([]);
    // On the client, if the fetch takes longer than 10ms, show a loading screen (this is so it doesn't render during hydration)
    else if (await Promise.race([schedule, new Promise((r) => setTimeout(r, 10))]))
        schedule = (await schedule) ?? error(500, "Failed to load schedule");

    return { schedule: schedule as Promise<Schedule[]> | Schedule[], detail: item, unspecified: !detail };
}
