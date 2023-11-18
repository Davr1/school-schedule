import { type Detail, DetailType } from "@/classes";
import headers from "@/loader/headers";

export const enum Week {
    Permanent = "Permanent",
    Current = "Actual",
    Next = "Next"
}

export interface FetchBakalariResponse {
    html: string;
    res: Response;
    sessionId: string;
}

/**
 * Fetch the public schedule from Bakalari.
 * @param week Week (Permanent, Actual, Next)
 * @param detail The detail to fetch the schedule for
 * @param sessionId The session ID to use (i'm not sure if this is needed, but a real browser sends this on subsequent requests)
 * @returns The html of the schedule and the response object
 */
async function fetchBakalari(week: Week, detail: Detail, sessionId?: string): Promise<FetchBakalariResponse> {
    // Throw an error if the detail type is not supported
    if (![DetailType.Class, DetailType.Teacher, DetailType.Room].includes(detail.type))
        throw new TypeError(`Unsupported detail type: ${detail.type}`);

    // Validate the week
    if (![Week.Permanent, Week.Current, Week.Next].includes(week)) throw new TypeError(`Unsupported week: ${week}`);

    const url = `https://is.sssvt.cz/IS/Timetable/Public/${week}/${detail.type}/${detail.id}`;
    const res = await fetch(url, {
        headers: {
            // Firefox headers
            ...headers,

            // If there are cookies, send them
            ...(sessionId ? { Cookie: "ASP.NET_SessionId=" + sessionId } : undefined)
        }
    });

    const newSessionId = res.headers.get("set-cookie")?.match(/(?<=ASP.NET_SessionId=)[^;]+/)?.[0] ?? sessionId!;

    // Return the html and the response object
    return {
        html: await res.text(),
        res,
        sessionId: newSessionId
    };
}

export default fetchBakalari;
