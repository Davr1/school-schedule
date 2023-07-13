/**
 * Combine an array of classes into a string
 *
 * Falsy values are ignored
 *
 * I'm tired of writing this...
 * @param classes Array of classes
 */
export function cls(...classes: (unknown | unknown[])[]): string {
    // Flatten the array first
    const flat = classes.flat(Infinity);

    // Filter out falsy values
    const filtered = flat.filter(Boolean);

    // Join the classes with a space
    return filtered.join(" ");
}
