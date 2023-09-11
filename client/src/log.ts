/**
 * Just a helper...
 *
 * Will only log if the LOG environment variable is set to true.
 * @param args Arguments to log
 */
function log(...args: unknown[]) {
    if (process.env.LOG) console.log(...args);
}

export default log;
