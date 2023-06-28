import { read, write } from "./storage.js";

/** The format of the archive */
export interface Archive {
    /** The timestamp of the last update */
    timestamp: number;
    /** The response from the school's server */
    response: string;
}

/** The storage object */
export type ArchiveStorage = Record<string, Archive>;

/**
 * Retrieve item from the archive
 * @param key The key to retrieve
 * @returns The archive
 */
export async function get(key: string): Promise<Archive | null> {
    // Get the storage
    const storage = await read<ArchiveStorage>();

    // Return the archive
    return storage[key] ?? null;
}

/**
 * Set item in the archive
 * @param key The key to set
 * @param value The value to set
 */
export async function set(key: string, value: Archive): Promise<void> {
    // Get the storage
    const storage = await read<ArchiveStorage>();

    // Set the value
    storage[key] = value;

    // Write the storage
    await write(storage);
}
