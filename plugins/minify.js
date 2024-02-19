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
        enforce: "pre", // Run before Vite's own ?raw loader

        /** Step 1: Load the raw file and minify it */
        async load(id) {
            if (!id.endsWith("?raw&minify")) return;
            id = id.slice(0, -11);

            const input = await readFile(id, "utf8");
            if (!input) return;

            const loader = id.endsWith(".css") ? "css" : id.endsWith(".ts") ? "ts" : "js";
            const { code, map } = await transform(input, {
                loader,
                minify: true,
                treeShaking: true,
                format: "esm",
                sourcefile: id,
                sourcemap: "external"
            });

            return { map, code };
        },

        /** Step 2: Export the result as a string */
        async transform(input, id) {
            if (!id.endsWith("?raw&minify")) return;

            const { map, code } = await transform(input, {
                loader: "text", // Default export of the input as a string
                format: "esm",
                sourcefile: id,
                sourcemap: "external"
            });

            return { map, code };
        }
    };
}
