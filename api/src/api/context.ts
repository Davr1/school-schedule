import { DetailHandler } from "@/classes";
import { BakalariParser, SSSVTParser } from "@/parser";

const details = new DetailHandler();

const context = {
    details,
    bakalariParser: new BakalariParser(details),
    sssvtParser: new SSSVTParser(details)
};

export default context;
export type ApiContext = typeof context;
