import { BakalariType } from "@/classes";
import fetchBakalari, { type FetchBakalariResponse, Week } from "@/loader/bakalari";

/**
 * All the classes to fetch.
 */
const classes = [
    "UK", //: "P1.A",
    "UL", //: "P1.B",
    "UM", //: "T1.C",
    "UG", //: "P2.A",
    "UI", //: "P2.B",
    "UJ", //: "T2.C",
    "UD", //: "P3.A",
    "UE", //: "P3.B",
    "UF", //: "T3.C",
    "UA", //: "P4.A",
    "UB", //: "P4.B",
    "UC" //: "T4.C"
];

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
    for (const id of shuffled) {
        // Fetch the schedule and add it to the object.
        const res = await fetchBakalari(week, BakalariType.Class, id, lastSessionId);
        schedules[id] = res;

        // Update the session ID.
        lastSessionId = res.sessionId;

        // Wait between 5 and 10 seconds.
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 5000 + 5000));
    }

    // Return the schedules.
    return schedules;
}

export default fetchAllClasses;
