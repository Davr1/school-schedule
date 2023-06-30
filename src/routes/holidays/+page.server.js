import { redirect } from "@sveltejs/kit";

import { HOLIDAYS } from "$env/static/private";

import holidays from "../../holidays.json" assert { type: "json" };

/**
 * Check if the holidays page should be available
 *
 * If it's not the holidays, redirect to the normal page
 *
 * Note: Only the last holiday will be checked. Add them as they happen and not in advance.
 */
export async function load() {
    // If the environment variable is not set to true, redirect to the main page
    if (HOLIDAYS.toLowerCase() !== "true") throw redirect(303, "/");

    // Get the last holiday
    const currentHoliday = holidays[holidays.length - 1];

    // Check if it's the holidays
    const start = new Date(currentHoliday.start);
    const end = new Date(currentHoliday.end);
    const today = new Date();

    // If it's not the holidays, redirect to the main page
    if (today < start || today > end) throw redirect(303, "/");
    // If it's the holidays, return the page
    else return currentHoliday;
}

// This page is just 2 lines of text so client-side rendering isn't required
export const csr = false;
