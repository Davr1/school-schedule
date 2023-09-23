import { encode } from "windows-1250";

import { type BakalariParams, urls } from "$stores/static";

/**
 * Fetch the main schedule from Bakalari
 * @param data The parameters to fetch the schedule with
 * @returns The schedule as html text (UTF-8)
 */
export async function fetchBaka(data: BakalariParams) {
    const url = `${urls.baka}/Timetable/Public/${data.weekMode}/${data.scheduleMode}/${data.value}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch schedule");

    return response.text();
}

/**
 * Fetch the substitution schedule from sssvt.cz
 *
 * Note: This uses the proxy endpoint
 * @param {Date} date The date to fetch the schedule for
 * @returns {Promise<string>} The schedule as a UTF-8 string
 */
export async function fetchWebSchedule(date: Date) {
    const formattedDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");

    // Fetch the schedule from the school's server
    const response = await fetch(`${urls.substitution}/${formattedDate}`);

    // If the response is not OK, throw an error
    if (!response.ok) throw new Error("Failed to fetch schedule");

    return response.text();
}

/**
 * Fetch the teacher / room schedule
 *
 * Note: also uses the proxy endpoint
 * @param mode The mode to fetch the schedule for (ig)
 * @param value
 * @param sub Whether to fetch the substitution schedule
 * @returns The schedule as a UTF-8 string
 */
export async function fetchWebScheduleAlt(mode: string, value: string, sub: boolean): Promise<string> {
    let encodedValue = Array.from(encode(value))
        .map((v) => "%25" + v.toString(16))
        .join("");

    const response = await fetch(`${urls.schedule}/${mode}/${encodedValue}/${sub ? "suplovaci" : ""}`);

    // If the response is not OK, throw an error
    if (!response.ok) throw new Error("Failed to fetch schedule");

    return response.text();
}

// Empty schedule, only used for getting teacher and room ids
export function fetchWebScheduleMetadata() {
    return fetch(`${urls.schedule}/class/`).then((response) => {
        if (response.ok) {
            return response.json();
        }
    });
}
