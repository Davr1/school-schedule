import type { MiddlewareHandler } from "hono";

/**
 * Replacer for JSON.stringify that removes null values
 */
const replacer = (_: string, value: any) => (value === null ? undefined : value);

/**
 * Minify json responses, when ?minify is present in the query
 * It will basically remove all null values (not in arrays) and whitespace
 *
 * This is the opposite of prettyJSON middleware
 */
export const minifyJSON: MiddlewareHandler = async (c, next) => {
    const minify = c.req.query("minify") !== undefined;

    // Call the next middleware
    await next();

    // Minify the response
    if (minify && c.res.headers.get("Content-Type")?.startsWith("application/json")) {
        const obj = await c.res.json();

        c.res = new Response(JSON.stringify(obj, replacer), c.res);
    }
};
