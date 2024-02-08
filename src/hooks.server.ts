import { DetailHandler, DetailType } from "@school-schedule/api/classes";

export function handle({ event, resolve }) {
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
}
