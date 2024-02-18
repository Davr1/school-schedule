import type { BakalariScheduleResponse } from "@school-schedule/api";
import { Detail, DetailHandler, DetailType, Schedule } from "@school-schedule/api/classes";
import type { ErrorResponse } from "@school-schedule/api/schemas";
import { error } from "@sveltejs/kit";

import { browser, dev } from "$app/environment";
import type { MaybePromise } from "$app/navigation";

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

    let schedule: MaybePromise<Schedule[]> = fetch(`/api/bakalari/${week}/${item}?minify`, { signal })
        .then<BakalariScheduleResponse | ErrorResponse>((res) => res.json())
        .then((json) => {
            if ("error" in json) throw new Error(json.error);

            // Register the additional details
            for (const detail of json.additionalDetails ?? []) DetailHandler.instance.add(Detail.fromJSON(detail, DetailHandler.instance));

            return json.schedules.map((s) => Schedule.fromJSON(s, DetailHandler.instance));
        })
        .catch((err) => {
            if (browser || dev) console.error(err);

            // If a timeout error occurred, silently ignore it
            if (err instanceof DOMException && err.name === "TimeoutError")
                return null!; // Small hack for typescript typings. This is handled below on the server, and can't be reached on the client
            else throw error(500, "Failed to load schedule");
        });

    // On the server, we want to await the promise (and return the value),
    // unless it times out, in which case we want to show a loading screen (by returning a promise)
    if (!browser) schedule = (await schedule) ?? Promise.resolve([]);
    // On the client, if the fetch takes longer than 10ms, show a loading screen (this is so it doesn't render during hydration)
    else if (await Promise.race([schedule, new Promise((r) => setTimeout(r, 10))]))
        schedule = (await schedule) ?? error(500, "Failed to load schedule");

    return { schedule, detail: item, unspecified: !detail };
}
