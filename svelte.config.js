import adapter from "@sveltejs/adapter-node";
import { readFile } from "fs/promises";
import sveltePreprocess from "svelte-preprocess";

// Get the version number from package.json.
const { version } = JSON.parse(await readFile(new URL("./package.json", import.meta.url)));

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        version: { name: version }
    },
    preprocess: sveltePreprocess()
};

export default config;
