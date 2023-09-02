import type { Element } from "domhandler";

import type { BakalariData } from "$lib/school/parser/bakalari/data";

/**
 * Get info about a potential change
 *
 * @param node The node to get the data from
 * @param data The data attribute of the node
 * @returns The change info or null if there is none
 */
function getChange(node: Element, data: BakalariData): string | null {
    // Check if there is a change (the element has the class "pink")
    const changed = node.attribs.class?.includes("pink");

    // Return null if there is no change
    if (!changed) return null;

    // Return the change info
    return data.changeinfo;
}

export default getChange;
