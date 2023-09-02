import Bakalari from "$lib/school/bakalari";
import getDateRange from "$lib/school/parser/bakalari/date";
import parse from "$lib/school/parser/bakalari/parse";
import getValue from "$lib/school/parser/bakalari/type";
import dom from "$lib/school/parser/dom";

/**
 * Scrape the data from the schedule
 *
 * @param html The html to scrape
 * @returns TODO:
 */
async function scrapeBakalari(html: string): Promise<Bakalari> {
    // Parse the html into a dom
    const scheduleDom = await dom(html);

    // Get the date of the schedule
    const [start, end] = getDateRange(scheduleDom);

    // Get the type and value of the schedule
    const { type, value } = getValue(scheduleDom);
    const permanent = start === null && end === null;

    // Parse the schedule
    const schedule = parse(scheduleDom);

    // Return the parsed data as a Bakalari class
    return new Bakalari(type, value, permanent, { start, end }, schedule);
}

export default scrapeBakalari;
