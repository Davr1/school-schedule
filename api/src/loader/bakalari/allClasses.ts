import { classes } from "@/classes/details/static";
import fetchBakalari, { type FetchBakalariResponse, Week } from "@/loader/bakalari";

interface FetchAllClassesResponse {
    [key: string]: FetchBakalariResponse;
}

/**
 * Fetch all class schedules from Bakalari.
 *
 * This will take about a minute or two to complete.
 * (there's an small delay between requests to not set off any alarms, doubt they care but whatever)
 * @param week Week (Permanent, Actual, Next)
 * @param sessionId The optional session ID to use (i'm not sure if this is needed, but a real browser sends this on subsequent requests)
 * @returns Object with the schedules
 */
async function fetchAllClasses(week: Week, sessionId?: string): Promise<FetchAllClassesResponse> {
    let lastSessionId = sessionId;

    // Randomize the order of classes.
    const shuffled = Array.from(classes).sort(() => Math.random() - 0.5);

    // Fetch all the schedules.
    const schedules: FetchAllClassesResponse = {};
    for (const detail of shuffled) {
        // Fetch the schedule and add it to the object.
        const res = await fetchBakalari(week, detail, lastSessionId);
        schedules[detail.id] = res;

        // Update the session ID.
        lastSessionId = res.sessionId;

        // Wait between 5 and 10 seconds.
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 5000 + 5000));
    }

    // Return the schedules.
    return schedules;
}

export default fetchAllClasses;
