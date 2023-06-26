import { BSON } from "bson";
import { readFile, writeFile } from "fs/promises";
import { promisify } from "util";
import { gunzip, gzip } from "zlib";

const gZip = promisify(gzip);
const gunZip = promisify(gunzip);

/**
 * @typedef Archive The format of the archive
 * @property {Number} timestamp The timestamp of the last update
 * @property {string} response The response from the school's server
 * @exports Archive
 */

/**
 * @typedef {Record<string, Archive>} ArchiveStorage The storage object
 * @exports ArchiveStorage
 */

/**
 * Serialize the data to BSON and GZip it
 *
 * This is to save space on the disk
 * @param {ArchiveStorage} data The data to serialize
 * @returns {Promise<Buffer>} The gzipped BSON as a buffer
 */
export async function serialize(data) {
    // Serialize the BSON
    const buffer = BSON.serialize(data);

    // GZip the buffer
    const gZiped = await gZip(buffer);

    return gZiped;
}

/**
 * Deserialize the BSON and un GZip it
 * @param {Buffer} buffer The gzipped BSON as a buffer
 * @returns {Promise<ArchiveStorage>} The deserialized data
 */
export async function deserialize(buffer) {
    // Un GZip the buffer
    const unGziped = await gunZip(buffer);

    // Deserialize the BSON
    const data = BSON.deserialize(unGziped);

    return data;
}

/**
 * Reads the file as a gzipped BSON and deserializes it
 *
 * Used internally by the archive
 * @param {string} file The file to read (defaults to data.bson)
 * @returns {Promise<ArchiveStorage>} The deserialized data
 */
export async function read(file = "data.bson") {
    // Read the file or create it if it doesn't exist
    let buffer;
    try {
        buffer = await readFile(file);
    } catch (error) {
        await write({});
        return {};
    }

    // Deserialize the BSON
    return await deserialize(buffer);
}

/**
 * Serializes the data and writes it to the file
 *
 * Used internally by the archive
 * @param {ArchiveStorage} data The data to serialize
 * @param {string} file The file to write (defaults to data.bson)
 * @returns {Promise<void>}
 */
export async function write(data, file = "data.bson") {
    // Serialize the BSON
    const buffer = await serialize(data);

    // Write the file
    await writeFile(file, buffer);
}
