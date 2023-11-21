import { DetailHandler } from "@/classes";
import { BakalariParser, SSSVTParser } from "@/parser";
import { classes, rooms, teachers } from "@/static";

const details = new DetailHandler();

const context = {
    details,
    bakalariParser: new BakalariParser(details),
    sssvtParser: new SSSVTParser(details)
};

// Load all static details
details.add(...classes, ...teachers, ...rooms);

export default context;
export type ApiContext = typeof context;
