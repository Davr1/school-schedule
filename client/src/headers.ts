/**
 * Headers stolen from Firefox 102.0 on Windows 10
 */
const headers = {
    // user agent
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:102.0) Gecko/20100101 Firefox/102.0",

    // accept everything that firefox does
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",

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

export default headers;
