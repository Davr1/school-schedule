/**
 * Only accept english, because the parser doesn't support other date formats
 */
const language = {
    "Accept-Language": "en-US,en;q=0.5"
};

/**
 * Headers from Mozilla Firefox 115.4.0esr (64-bit) on Windows 10
 *
 * This only works for server side requests, on browsers you can't change them
 */
const headers = {
    // user agent
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0",

    // accept everything that firefox does
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    ...language,

    // upgrade insecure requests
    "Upgrade-Insecure-Requests": "1",

    // fetch metadata ig
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",

    // caches
    "Cache-Control": "no-cache",
    Pragma: "no-cache"
} as const;

// Export the headers, on the browser only the language is used
export default typeof window === "undefined" ? headers : language;
