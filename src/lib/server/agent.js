import { SocksProxyAgent } from "socks-proxy-agent";

import { PROXY } from "$env/static/private";

/** @type {SocksProxyAgent} */
let socksProxyAgent;

/**
 * The user agent to use for making requests
 */
export const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";

/**
 * Get the proxy agent to use for the request
 *
 * This will be undefined if `process.env.PROXY` isn't defined
 *
 * The PROXY environment variable must be a URI..
 *
 * @returns {SocksProxyAgent | undefined} The http agent to be used for making requests.
 */
export function getHttpsAgent() {
    // If the agent is already defined, return it
    if (socksProxyAgent) return socksProxyAgent;

    // Return undefined if proxying isn't enabled
    if (!PROXY) return;

    // Create the agent
    socksProxyAgent = new SocksProxyAgent(PROXY);

    // Return the agent
    return socksProxyAgent;
}
