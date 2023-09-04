import type Redis from "ioredis";

/** Types of metadata */
export const enum MetadataType {
    /** A subject */
    Subject = "subject",

    /** A teacher */
    Teacher = "teacher"
}

/**
 * Metadata "cache"
 *
 * This object contains the metadata that has already been stored in redis so we don't have to query it every time
 * @private
 */
const metadata: {
    /** Whether the metadata cache has been loaded from redis */
    load: boolean | Promise<boolean>;

    /** The cached subhect metadata */
    [MetadataType.Subject]: string[];

    /** The cached teacher metadata */
    [MetadataType.Teacher]: string[];
} = { load: false, [MetadataType.Subject]: [], [MetadataType.Teacher]: [] };

/**
 * Store metadata if it doesn't exist yet
 *
 * Stores teacher names and subject names so they're not duplicated in each lesson
 * @param type The type of the metadata (subject or teacher)
 * @param key The key of the metadata
 * @param value The value of the metadata
 * @param redis The redis instance to store the metadata in
 */
async function storeMetadata(type: MetadataType, key: string, value: string, redis: Redis) {
    // Skip empty values (such as "" or "...")
    if (!value || key === "....") return;

    // If the metadata cache hasn't been loaded yet, fetch it from redis
    if (!metadata.load) await retrieveMetadata(redis);
    // Or just wait if it's still loading
    else if (metadata.load instanceof Promise) await metadata.load;

    // If the metadata doesn't exist yet, store it
    if (!metadata[type].includes(key)) {
        // Add the metadata to the cache
        metadata[type].push(key);

        // Store the metadata
        await redis.set(`schedule:bakalari:${type}:${key}`, value);
    }
}

/**
 * Retrieve initial cache from redis
 *
 * Note: this is probably really slow cuz it uses keys but ehh, it's only run once on startup
 * @param redis The redis instance to retrieve the cache from
 * @private
 */
export function retrieveMetadata(redis: Redis) {
    // Set the load flag to a promise that resolves when the metadata is loaded
    metadata.load = new Promise(async (resolve) => {
        // Get the subject and teacher keys
        const [subjectKeys, teacherKeys] = await Promise.all([
            redis.keys("schedule:bakalari:subject:*"),
            redis.keys("schedule:bakalari:teacher:*")
        ]);

        // Store the keys in the metadata object
        metadata[MetadataType.Subject] = subjectKeys.map((key) => key.replace("schedule:bakalari:subject:", ""));
        metadata[MetadataType.Teacher] = teacherKeys.map((key) => key.replace("schedule:bakalari:teacher:", ""));

        // Resolve the promise and set the load flag to true
        resolve(true);
        metadata.load = true;
    });

    // Return the promise
    return metadata.load;
}

export default storeMetadata;
