/** This file isn't a part of the schedule. It's just for testing the parser... */
import parse from "$lib/parser";
import { read } from "$lib/server/storage";

const file = await read();

Object.entries(file).forEach(async ([key, value]) => {
    console.log(key, await parse(value));
});
