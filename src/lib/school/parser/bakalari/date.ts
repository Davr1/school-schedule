import selectAll from "css-select";
import type { AnyNode } from "domhandler";

import getDay from "$lib/school/parser/bakalari/day";

/**
 * Get the date range of the schedule
 *
 * @param dom The dom to scrape
 * @returns A tuple with the start and end date. Warning: The dates are in UTC
 */
function getDateRange(dom: AnyNode[]) {
    // Find all of the date labels
    const dates = selectAll(".bk-day-wrapper", dom);

    // Get the first and last date
    const first = getDay(dates[0]);
    const last = getDay(dates[dates.length - 1]);

    // Return the date range as a tuple
    return [first, last] as const;
}

export default getDateRange;
