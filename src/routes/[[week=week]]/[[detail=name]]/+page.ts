import type { BakalariScheduleResponse } from "@school-schedule/api";
import { Detail, DetailHandler, DetailType, Schedule } from "@school-schedule/api/classes";
import { BakalariParser } from "@school-schedule/api/parser";
import { BakalariRequest, language } from "@school-schedule/api/request";
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

    // On the server, this fetch request is caught by hooks.server.ts and instead requests the api server
    // This means we don't have to include Bakalari's html in our response, and we can just use the parsed schedules
    // But on the client, we obviously have to fetch the html and parse it here (it's faster anyway)
    let schedule: MaybePromise<Schedule[]> = fetch(new BakalariRequest(week, item, { headers: language }), { signal })
        .then<BakalariScheduleResponse | ErrorResponse | string>((res) => {
            // If the response is JSON (meaning we're either on server or hydrating, and the request is actually from the api) parse it as JSON,
            // otherwise as text (which means we're on the client, and we have to parse the HTML ourselves)
            if (res.headers.get("content-type")?.startsWith("application/json")) return res.json();

            return res.text();
        })
        .then((res) => {
            // If the response is a string, parse it as HTML
            if (typeof res === "string") {
                const dom = new DOMParser().parseFromString(res, "text/html");
                return BakalariParser.instance.parse(item, dom);
            }

            // If the response is an error, throw it
            if ("error" in res) throw new Error(res.error);

            // Register the additional details from the api response
            for (const detail of res.additionalDetails ?? []) DetailHandler.instance.add(Detail.fromJSON(detail, DetailHandler.instance));

            return res.schedules.map((s) => Schedule.fromJSON(s, DetailHandler.instance));
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
