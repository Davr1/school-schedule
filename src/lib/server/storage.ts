import type { Document } from "bson";
import { BSON } from "bson";
import { readFile, writeFile } from "fs/promises";
import { promisify } from "util";
import { gunzip, gzip } from "zlib";

const gZip = promisify(gzip);
const gunZip = promisify(gunzip);

/**
 * Serialize the data to BSON and GZip it
 *
 * This is to save space on the disk
 * @param data The data to serialize
 * @returns The gzipped BSON as a buffer
 */
export async function serialize<T extends Document = Document>(data: T): Promise<Buffer> {
    // Serialize the BSON
    const buffer = BSON.serialize(data);

    // GZip the buffer
    const gZiped = await gZip(buffer);

    return gZiped;
}

/**
 * Deserialize the BSON and un GZip it
 * @param buffer The gzipped BSON as a buffer
 * @returns The deserialized data
 */
export async function deserialize<T extends Document>(buffer: Buffer): Promise<T> {
    // Un GZip the buffer
    const unGziped = await gunZip(buffer);

    // Deserialize the BSON
    const data = BSON.deserialize(unGziped) as T;

    return data;
}

/**
 * Reads the file as a gzipped BSON and deserializes it
 *
 * Used internally by the archive
 * @param file The file to read (defaults to data.bson)
 * @returns The deserialized data
 */
export async function read<T extends Document = Document>(file: string = "cache/data.bson"): Promise<T> {
    // Read the file or create it if it doesn't exist
    let buffer: Buffer;
    try {
        buffer = await readFile(file);
    } catch (error) {
        await write({});
        return {} as T; // This is dumb lmaoo
    }

    // Deserialize the BSON
    return await deserialize<T>(buffer);
}

/**
 * Serializes the data and writes it to the file
 *
 * Used internally by the archive
 * @param data The data to serialize
 * @param file The file to write (defaults to data.bson)
 */
export async function write<T extends Document = Document>(data: T, file: string = "cache/data.bson"): Promise<void> {
    // Serialize the BSON
    const buffer = await serialize(data);

    // Write the file
    await writeFile(file, buffer);
}
