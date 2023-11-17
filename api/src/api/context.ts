import { DetailHandler } from "@/classes";
import { BakalariParser } from "@/parser";

export interface ApiContext {
    details: DetailHandler;
    bakalariParser: BakalariParser;
}

const details = new DetailHandler();

const context: ApiContext = {
    details,
    bakalariParser: new BakalariParser(details)
};

export default context;
