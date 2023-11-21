import headers from "@/loader/headers";

/**
 * Fetch the substitution schedule from sssvt.cz.
 * @param date The date of the schedule to fetch
 * @returns The html of the substitution schedule
 */
async function fetchSSSVT(date: Date): Promise<string> {
    // Get the date in the format that sssvt.cz uses
    const stringDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");

    const url = "https://rozvrh.icy.cx/sssvt/substitution/" + stringDate;
    const res = await fetch(url, {
        // Firefox headers
        headers
    });

    // Return the html and the response object
    return await res.text();
}

export default fetchSSSVT;
