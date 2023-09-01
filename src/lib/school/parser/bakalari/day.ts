import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Get the day from a row
 *
 * @param row The row to parse
 * @returns The day (from the enum)
 */
function getDay(node: AnyNode) {
    const dayNode = selectOne(".bk-day-date", node);

    if (!dayNode) throw new Error("Could not find the day node");

    const text = textContent(dayNode);
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

export default getDay;
