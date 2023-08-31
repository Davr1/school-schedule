import selectAll from "css-select";

import dom from "$lib/school/parser/dom";
import schoolClass from "$lib/school/parser/sssvt/class";
import getDate from "$lib/school/parser/sssvt/date";
import SSSVT from "$lib/school/sssvt";

/**
 * Scrape the data from the substitution schedule
 *
 * @param html The html to scrape
 * @returns A SSSVT class with the scraped data
 */
async function scrape(html: string) {
    // Parse the html into a dom
    const scheduleDom = await dom(html);

    // Get all the classes from the table (skip odd rows [which also skips the header])
    const classNodes = selectAll(".table-responsive tr:nth-child(2n)", scheduleDom);

    // Loop through all the classes and parse them
    // Note: Since the function can return undefined, I filter out the falsy values
    const subsitutions = classNodes.map(schoolClass).filter(Boolean) as NonNullable<ReturnType<typeof schoolClass>>[];

    // Turn the array into an object
    const classes = Object.fromEntries(subsitutions.map(({ name, substitutions }) => [name, substitutions]));

    // Get the date of the schedule
    const date = getDate(scheduleDom);

    // If there's no date, return null
    if (!date) return null;

    // Return the parsed data as a SSSVT class
    return new SSSVT(date, classes);
}

export default scrape;
