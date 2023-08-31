import dom from "$lib/parser/dom";
import scrape from "$lib/parser/scrape";

/**
 * Parse the school's substitution schedule into a usable format
 *
 * @param html The html to parse
 * @returns The parsed data
 */
async function parse(html: string) {
    // Parse the html into a dom
    const scheduleDom = await dom(html);

    // Scrape the data from the dom
    return scrape(scheduleDom);
}

export default parse;
