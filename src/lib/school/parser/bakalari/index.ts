import Bakalari from "$lib/school/bakalari";
import getDateRange from "$lib/school/parser/bakalari/date";
import parse from "$lib/school/parser/bakalari/parse";
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
    const [first, last] = getDateRange(scheduleDom);

    console.log(first, last);
    // If there's no date, return null
    // if (!date) return null;

    // Parse the schedule
    const schedule = parse(scheduleDom);

    // Return the parsed data as a Bakalari class
    return new Bakalari(first, last, schedule);
}

export default scrapeBakalari;
