import { read, write } from "./storage.js";

/**
 * @typedef {import("$lib/server/storage.js").Archive} Archive The format of the archive
 */

/**
 * @typedef {import("$lib/server/storage.js").ArchiveStorage} ArchiveStorage The storage object
 */

/**
 * Retrieve item from the archive
 * @param {string} key The key to retrieve
 * @returns {Promise<Archive | null>} The archive
 */
export async function get(key) {
    // Get the storage
    const storage = await read();

    // Return the archive
    return storage[key] ?? null;
}

/**
 * Set item in the archive
 * @param {string} key The key to set
 * @param {Archive} value The value to set
 * @returns {Promise<void>}
 */
export async function set(key, value) {
    // Get the storage
    const storage = await read();

    // Set the value
    storage[key] = value;

    // Write the storage
    await write(storage);
}
