import { transform } from "esbuild";
import { readFile } from "fs/promises";

/**
 * A custom Vite plugin that minifies the raw contents of a file with the `?raw&minify` query.
 *
 * Only supports JavaScript and CSS files.
 * @returns {import("vite").Plugin}
 */
export function rawMinifyPlugin() {
    return {
        name: "raw-minify-plugin",

        async transform(_, id) {
            if (!id.endsWith("?raw&minify")) return;
            id = id.slice(0, -11);

            const input = await readFile(id, "utf8");
            if (!input) return;

            const loader = id.endsWith(".css") ? "css" : id.endsWith(".ts") ? "ts" : "js";
            const { code } = await transform(input, {
                loader,
                minify: true,
                treeShaking: true,
                format: "esm"
            });

            return `export default ${JSON.stringify(code.trim())};`;
        }
    };
}
