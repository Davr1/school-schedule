import selectAll from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Get the date range of the schedule
 *
 * @param dom The dom to scrape
 * @returns A tuple with the start and end date. Warning: The dates are in UTC
 */
function getDateRange(dom: AnyNode[]) {
    // Find all of the date labels
    const dates = selectAll(".bk-day-date", dom);

    // Get the first and last date
    const first = parseDay(dates[0]);
    const last = parseDay(dates[dates.length - 1]);

    // Return the date range as a tuple
    return [first, last] as const;
}

/**
 * Parse the day from a date label
 *
 * @param node The node to parse
 * @returns The date
 * @private
 */
function parseDay(node: AnyNode) {
    const text = textContent(node);
    const [day, month] = text.split("/").map(Number);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let year: number;
    // If the month is December and the current month is january, then the date is from last year
    if (month === 11 && currentMonth === 0) year = currentYear - 1;
    // If the month is January and the current month is December, then the date is from next year
    else if (month === 0 && currentMonth === 11) year = currentYear + 1;
    // Otherwise, the date is from the current year
    else year = currentYear;

    // Parse the date into a Date object
    return new Date(Date.UTC(year, month - 1, day));
}

export default getDateRange;
