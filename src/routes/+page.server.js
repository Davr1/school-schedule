import { redirect } from "@sveltejs/kit";

import { HOLIDAYS } from "$env/static/private";

import holidays from "../holidays.json" assert { type: "json" };

/**
 * Check if the page should be available
 *
 * If it's the holidays, redirect to the holidays page
 *
 * Note: Only the last holiday will be checked. Add them as they happen and not in advance.
 */
export async function load() {
    // If the environment variable is not set to true, return the page as usual
    if (HOLIDAYS.toLowerCase() !== "true") return {};

    // Get the last holiday
    const currentHoliday = holidays[holidays.length - 1];

    // Check if it's the holidays
    const start = new Date(currentHoliday.start);
    const end = new Date(currentHoliday.end);
    const today = new Date();

    // If it's not the holidays, return the page as usual
    if (today < start || today > end) return {};
    // If it's the holidays, redirect to the holidays page
    else throw redirect(303, "/holidays");
}
