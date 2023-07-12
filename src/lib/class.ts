import type { Falsey, RecursiveArray } from "lodash";
import { compact, flattenDeep } from "lodash-es";

/**
 * Combine an array of classes into a string
 *
 * Falsy values are ignored
 *
 * I'm tired of writing this...
 * @param classes Array of classes
 */
export function cls(...classes: RecursiveArray<string | Falsey>): string {
    // Flatten the array first
    const flat = flattenDeep(classes); // Using lodash because .flat() doesn't do it recursively

    // Filter out falsy values
    const filtered = compact(flat);

    // Join the classes with a space
    return filtered.join(" ");
}
