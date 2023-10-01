import { selectOne } from "css-select";
import type { AnyNode } from "domhandler";
import { textContent } from "domutils";

/**
 * Parse a full day event from the day row
 *
 * @param node The day node to check
 * @returns Null or the full day event details
 */
function parseEvent(node: AnyNode): null | string {
    // Find the full day event node
    const event = selectOne(".empty", node);

    // Return null if there is no full day event
    if (event === null) return null;

    // Return the full day event text
    return textContent(event).trim();
}

export default parseEvent;
