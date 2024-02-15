import headers from "@/request/headers";

export class SSSVTRequest extends Request {
    constructor(
        readonly date: Date,
        init?: RequestInit
    ) {
        // Format the date
        const param = SSSVTRequest.#formatDate(date);

        super(`https://rozvrh.icy.cx/sssvt/substitution/${param}`, { headers, ...init });
    }

    /** Get the date in the format that sssvt.cz uses */
    static #formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
}
