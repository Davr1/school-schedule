import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Check for a full day event
 *
 * @param node The day node to check
 * @returns Null or the full day event details
 */
function getEvent(node: AnyNode): null | string {
    // Find the full day event node
    const fullDayEvent = selectOne(".empty", node);

    // Return null if there is no full day event
    if (fullDayEvent === null) return null;

    // Return the full day event text
    return textContent(fullDayEvent).trim();
}

export default getEvent;
