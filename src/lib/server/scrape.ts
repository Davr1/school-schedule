/** This file isn't a part of the schedule. It's just for testing the parser... */
import scrapeBakalari from "$lib/school/parser/bakalari";
import { read } from "$lib/server/storage";

const file = await read();

Object.entries(file).forEach(async ([key, value]) => {
    // console.log(key, await scrapeSSSVT(value));
});

// Get the bakalari test file
const text = await fetch("http://localhost:3000/src/bak");

// Scrape the data
console.log(await scrapeBakalari(await text.text()));
