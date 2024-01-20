import { DetailHandler } from "@school-schedule/api/classes";
import { BakalariParser } from "@school-schedule/api/parser";
import { parseHTML } from "@school-schedule/api/parser/domhandler";

import { browser } from "$app/environment";

const parser = browser ? new DOMParser() : null;

const details = new DetailHandler();
const bk = new BakalariParser(details);

export async function load({ fetch }) {
    const html = await fetch("https://rozvrh.icy.cx/bakalari/UE").then((res) => res.text());

    const dom = browser ? parser!.parseFromString(html, "text/html") : await parseHTML(html);
    const schedule = bk.parse(details.get("UE")!, dom);

    return { schedule };
}
