import { DetailHandler, DetailType } from "@school-schedule/api/classes";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

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
 *
 * @type {Handle}
 */
const preloadFonts: Handle = ({ event, resolve }) => {
    return resolve(event, {
        preload(input) {
            return input.type === "css" || input.type === "js" || (input.type === "font" && input.path.endsWith(".woff2"));
        }
    });
};

export const handle = sequence(rootRedirect, preloadFonts);
