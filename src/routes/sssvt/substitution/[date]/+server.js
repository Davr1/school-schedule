import axios from "axios";
import { decode } from "windows-1250";
import { getHttpsAgent, userAgent } from "../../../../lib/server/agent"; // ... can we use ts paths..... please.

/**
 * Get the school's substitution schedule for the given date
 *
 * The date must be specified in the slug and be in the same format the school uses.. [YYYY-MM-DD]
 * @type {import('@sveltejs/kit').RequestHandler}
 * @returns The schedule as a UTF-8 string
 */
export async function GET({ params }) {
    // The date must be specified in the slug and be in the same format the school uses..
    const date = params.date;

    // Parse the date
    const [year, month, day] = date.split("-").map(Number);
    /** @type {Date} */
    let dateObj;
    try {
        dateObj = new Date(year, month - 1, day); // Month is 0-indexed
    } catch (err) {
        return new Response("Invalid date", { status: 400 });
    }

    // Validate the date
    // This is to prevent sending invalid data to the school's server
    // There's no school over the weekend so don't send a request lmaoo
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6)
        // Sunday = 0, Saturday = 6
        return new Response("Won't fetch schedule for a weekend day", { status: 400 });

    // Fetch the schedule from the school's server
    const response = await axios.get(`https://www.sssvt.cz/main.php?p=IS&pp=suplak&datum=${date}`, {
        httpsAgent: getHttpsAgent(),
        headers: { "User-Agent": userAgent },
        responseType: "arraybuffer",
        responseEncoding: "binary"
    });

    // If the response is not OK, return the same response
    if (response.status !== 200) return new Response(response.data, { status: response.status });

    // Get the response as text and parse it from that weird formatting
    const buffer = Buffer.from(response.data);
    const parsed = decode(buffer);

    // Return the parsed schedule
    return new Response(parsed, {
        headers: {
            "content-type": "text/plain; charset=utf-8", // I don't want browsers to render this as HTML if you for some reason open it..
            "x-message": "you're welcome.. do whatever tf you want..." // Yes I did add a message...
        }
    });
}
