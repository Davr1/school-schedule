import Bakalari from "@/classes/bakalari";
import parse from "@/parser/bakalari/parse";
import getValue from "@/parser/bakalari/type";
import dom from "@/parser/dom";

/**
 * Scrape the data from the schedule
 *
 * @param html The html to parse
 * @returns TODO:
 */
async function parseBakalari(html: string): Promise<Bakalari> {
    // Parse the html into a dom
    const scheduleDom = await dom(html);

    // Get the type and value of the schedule
    const { type, value } = getValue(scheduleDom);

    // Parse the schedule
    const schedule = parse(scheduleDom);

    // Return the parsed data as a Bakalari class
    return new Bakalari(type, value, schedule);
}

export default parseBakalari;
