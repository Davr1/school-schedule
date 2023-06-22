import { decode } from "windows-1250";

/**
 * Get the school's schedule.. This is basically just a proxy for the /IS/rozvrh-hodin endpoint
 *
 * The url must be specified in the slug
 *
 * You're responsible for not sending invalid data to the school's server
 * @type {import('@sveltejs/kit').RequestHandler}
 * @returns The schedule as a UTF-8 string
 */
export async function GET({ params }) {
    // The url must be specified in the slug
    const url = params.path;

    // Fetch the schedule from the school's server
    const response = await fetch(`https://www.sssvt.cz/IS/rozvrh-hodin/${url}`);

    // If the response is not OK, return the same response
    if (!response.ok) return response;

    // Get the response as text and parse it from whatever the fuck that is
    const text = await response.arrayBuffer();
    const buffer = Buffer.from(text);
    const parsed = decode(buffer);

    // Return the parsed schedule
    return new Response(parsed, {
        headers: {
            "content-type": "text/plain; charset=utf-8", // I don't want browsers to render this as HTML if you for some reason open it..
            "x-message": "you're welcome.. do whatever tf you want..." // Yes I did add a message...
        }
    });
}
