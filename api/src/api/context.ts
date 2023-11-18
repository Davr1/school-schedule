import { DetailHandler } from "@/classes";
import { BakalariParser } from "@/parser";
import { classes, rooms, teachers } from "@/static";

export interface ApiContext {
    details: DetailHandler;
    bakalariParser: BakalariParser;
}

const details = new DetailHandler();

const context: ApiContext = {
    details,
    bakalariParser: new BakalariParser(details)
};

// Load all static details
details.add(...classes, ...teachers, ...rooms);

export default context;
