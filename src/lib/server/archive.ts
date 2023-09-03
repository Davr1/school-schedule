import { read, write } from "./storage.js";

/** The format of the archive */
export interface Archive {
    /** The timestamp of the last update */
    timestamp: number;
    /** The response from the school's server */
    response: string;
}

/**
 * Retrieve item from the archive
 * @param key The key to retrieve
 * @returns The archive
 */
export async function get(key: string): Promise<Archive | null> {
    // Get the storage
    const storage = await read<Archive>(`cache/${key}.bson`);

    // Return the archive
    return storage ?? null;
}

/**
 * Set item in the archive
 * @param key The key to set
 * @param value The value to set
 */
export async function set(key: string, value: Archive): Promise<void> {
    // Write the storage
    await write(value, `cache/${key}.bson`);
}
