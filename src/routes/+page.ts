import { browser } from "$app/environment";

import { DetailHandler } from "@/classes";
import { BakalariParser, parseHTML } from "@/parser";

const parser = browser ? new DOMParser() : null;

const details = new DetailHandler();
const bk = new BakalariParser(details);

export async function load() {
    const html = await fetch("https://rozvrh.icy.cx/bakalari/UE").then((res) => res.text());

    const dom = browser ? parser!.parseFromString(html, "text/html") : await parseHTML(html);
    const schedule = bk.parse(details.get("UE")!, dom);

    return { schedule };
}
