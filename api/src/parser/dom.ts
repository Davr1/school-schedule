import { type ChildNode, DomHandler } from "domhandler";
import { Parser } from "htmlparser2";

/**
 * Parse a string into a dom
 *
 * @param html The html string to parse
 * @returns A promise that resolves to the dom
 */
function dom(html: string) {
    return new Promise<ChildNode[]>((resolve, reject) => {
        // Create a new dom handler that resolves the promise when it's done
        const handler = new DomHandler((error, dom) => {
            if (error) reject(error);
            else resolve(dom);
        });

        // Create a new parser with the handler
        const parser = new Parser(handler);

        // Write the html to the parser
        parser.write(html);
        parser.end();
    });
}

export default dom;
