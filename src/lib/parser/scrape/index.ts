import selectAll from "css-select";
import type { AnyNode } from "domhandler";

import schoolClass from "$lib/parser/scrape/class";

/**
 * Scrape the data from the substitution schedule
 *
 * @param dom The dom to scrape
 */
function scrape(dom: AnyNode[]) {
    // Get all the classes from the table (skip odd rows [which also skips the header])
    const classes = selectAll(".table-responsive tr:nth-child(2n)", dom);

    // Loop through all the classes and parse them
    return classes.map(schoolClass);
}

export default scrape;
