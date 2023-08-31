import { selectOne } from "css-select";
import { type AnyNode, isTag } from "domhandler";

/**
 * Get the date from a sub schedule page
 *
 * @param dom The dom to scrape
 */
function getDate(dom: AnyNode[]) {
    // The date can be found in the title of the link to today's schedule
    // The link is the first <a> tag after the <strong> tag with the day
    const date = selectOne("#dny strong + a", dom);

    // If there's no date (or it's not a tag), return null
    if (!date || !isTag(date)) return null;

    // The date is in the title attribute
    return date.attribs.title;
}

export default getDate;
