import { selectOne } from "css-select";
import { type AnyNode, isTag } from "domhandler";

/**
 * Parse the date from a substitution schedule page
 *
 * @param dom The dom to parse
 */
function parseDate(dom: AnyNode[]) {
    // The date can be found in the title of the link to today's schedule,
    // which is the first <a> tag after the <strong> tag that shows the day
    const dateNode = selectOne("#dny strong + a", dom);

    // If there's no date node (or it's not a tag), throw an error
    if (!dateNode || !isTag(dateNode)) throw new Error("Couldn't find the date node");

    // Parse the "title" attribute as a Date object
    // (it's in the format "YYYY-MM-DD", so it can be parsed as is)
    return new Date(dateNode.attribs.title);
}

export default parseDate;
