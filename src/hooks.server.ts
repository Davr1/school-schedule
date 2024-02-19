import api from "@school-schedule/api";
import { DetailHandler, DetailType } from "@school-schedule/api/classes";
import type { Week } from "@school-schedule/api/request";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { env } from "$env/dynamic/private";

/**
 * "/" route redirect handler
 */
const rootRedirect: Handle = ({ event, resolve }) => {
    // If the user requested the root path but sent us a cookie with a default value, redirect them to the schedule for that detail
    if (event.url.pathname === "/") {
        const name = event.cookies.get("detail");
        const detail = name && DetailHandler.instance.get(name);

        // If the cookie is valid, redirect to the schedule for the detail
        if (detail && ![DetailType.Class, DetailType.Teacher, DetailType.Room].includes(detail.type))
            return new Response(null, {
                status: 302,
                headers: {
                    // Redirect to the schedule for the detail
                    Location: `/${encodeURIComponent(detail.name!)}`
                }
            });
    }

    return resolve(event);
};

/**
 * Font preloading handler
 */
const preloadFonts: Handle = ({ event, resolve }) => {
    return resolve(event, {
        preload(input) {
            return input.type === "css" || input.type === "js" || (input.type === "font" && input.path.endsWith(".woff2"));
        }
    });
};

/**
 * Redirect to the correct server for api requests
 * If API_ENDPOINT is set, proxy the request to that address, otherwise use the built-in api
 *
 * In prod, just use nginx for the separate api server (and use API_ENDPOINT for server side requests).
 * In dev it's easier to use the built-in api.
 *
 * The built-in api is probably slower, and doesn't use the scheduler to cache schedules.
 */
const builtinApi: Handle = async ({ event, resolve }) => {
    if (!event.url.pathname.startsWith("/api")) return resolve(event);

    const url = new URL(event.request.url);

    // If the API_ENDPOINT is set, proxy the request to that address
    if (env.API_ENDPOINT) {
        const proxied = new URL(env.API_ENDPOINT);
        proxied.pathname = url.pathname;
        proxied.search = url.search;

        const res = await fetch(new Request(proxied, event.request));
        const headers = new Headers(res.headers);

        // Not removing these headers will cause issues with the response!
        headers.delete("Content-Encoding");
        headers.delete("Content-Length");

        return new Response(res.body, { ...res, headers });
    }

    // Otherwise, use the built-in api
    else {
        url.pathname = url.pathname.replace(/^\/api/, "");

        return api.fetch(new Request(url, event.request));
    }
};

/** Include the `Content-Type` header in responses */
const contentType: Handle = ({ resolve, event }) => {
    return resolve(event, {
        filterSerializedResponseHeaders: (name) => name.toLowerCase() === "content-type"
    });
};

export const handle = sequence(rootRedirect, preloadFonts, builtinApi, contentType);

/**
 * A small "hack" to get around how SvelteKit handles inserting the output of `fetch` inside universal load function.
 *
 * This will replace all requests to Bakalari with requests to the new API.
 * Note: this only happens for server side requests, client side requests are not affected.
 */
export function handleFetch({ fetch, request }) {
    const match = request.url.match(/^https:\/\/is.sssvt.cz\/IS\/Timetable\/Public\/([A-Z][a-z]+)\/[A-Z][a-z]+\/([A-Z0-9]+)$/);
    if (!match) return fetch(request);

    const week = match[1] as Week;
    const id = match[2];

    return fetch(`/api/bakalari/${week}/${id}?minify`);
}
