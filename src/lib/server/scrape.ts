/** This file isn't a part of the schedule. It's just for testing the parser... */
import Redis from "ioredis";

import scrapeBakalari from "$lib/school/parser/bakalari";
import { read } from "$lib/server/storage";
import storeBakalari from "$lib/server/store/bakalari";

const file = await read();

Object.entries(file).forEach(async ([key, value]) => {
    // console.log(key, await scrapeSSSVT(value));
});

const redis = new Redis();

// Get the bakalari test file
const text = await fetch("http://localhost:3000/src/bak7");

// Scrape the data
const bakalari = await scrapeBakalari(await text.text());

// clear all data beforehand
await redis.flushall();

await storeBakalari(bakalari, redis);

// create the index
await redis.call(
    "FT.CREATE",
    "idx:schedule:bakalari:lesson",
    "ON",
    "HASH",
    "PREFIX",
    "1",
    "schedule:bakalari:lesson:",
    "SCHEMA",

    // Date
    "date",
    "NUMERIC",

    // Period
    "period",
    "NUMERIC",

    // Class
    "class",
    "TAG",

    // Groups
    "group",
    "TAG",

    // Teacher
    "teacher",
    "TAG",

    // Room
    "room",
    "TAG"
);

redis.disconnect();
