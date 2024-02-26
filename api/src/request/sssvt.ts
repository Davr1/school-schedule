import { decode } from "windows-1250";

import headers from "@/request/headers";
import { dayInUTC, formatDate } from "@/util";

export class SSSVTRequest extends Request {
    constructor(
        readonly date: Date,
        init?: RequestInit
    ) {
        if (isNaN(date.getTime())) throw new TypeError("Invalid date");

        const day = date.getDay();
        if (day === 0 || day === 6) throw new TypeError("Saturday / Sunday is not a school day");

        super(`https://www.sssvt.cz/main.php?p=IS&pp=suplak&datum=${formatDate(dayInUTC(date))}`, { headers, ...init });
    }
}

export class SSSVTResponse extends Response {
    // Bun doesn't support this as of rn, so I'm using an npm package instead
    // static #decoder = new TextDecoder("windows-1250");

    constructor(base: Response) {
        super(base.body, base);
    }

    async text(): Promise<string> {
        const bytes = await super.arrayBuffer();

        // const text = SSSVTResponse.#decoder.decode(bytes);
        const text = decode(new Uint8Array(bytes));
        return text.replace("windows-1250", "utf-8");
    }
}
