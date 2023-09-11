import headers from "@/headers";

export const enum ScheduleType {
    Class = "Class",
    Teacher = "Teacher",
    Room = "Room"
}

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
 * @param type Type (Class, Teacher, Room)
 * @param value Value of the schedule type (room, class or teacher id)
 * @param sessionId The session ID to use (i'm not sure if this is needed, but a real browser sends this on subsequent requests)
 * @returns The html of the schedule and the response object
 */
async function fetchBakalari(week: Week, type: ScheduleType, value: string, sessionId?: string): Promise<FetchBakalariResponse> {
    // Cookies to send, will be empty if no session ID is provided
    const cookies: string[] = [];
    if (sessionId) cookies.push(`ASP.NET_SessionId=${sessionId}`);

    const url = `https://is.sssvt.cz/IS/Timetable/Public/${week}/${type}/${value}`;
    const res = await fetch(url, {
        headers: {
            // Firefox headers
            ...headers,

            // If there are cookies, send them
            ...(cookies.length > 0 ? { Cookie: cookies.join("; ") } : {})
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
