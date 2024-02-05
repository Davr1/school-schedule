import { DetailHandler } from "@/classes";
import { BakalariParser, SSSVTParser } from "@/parser";

const details = DetailHandler.instance;

const context = {
    details,
    bakalariParser: new BakalariParser(details),
    sssvtParser: new SSSVTParser(details)
};

export default context;
export type ApiContext = typeof context;
