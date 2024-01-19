import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { readFile } from "fs/promises";

// Get the version number from package.json.
const { version } = JSON.parse(await readFile(new URL("./package.json", import.meta.url)));

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        version: { name: version },
        alias: {
            $components: "./src/components/",
            $stores: "./src/stores/",
            $styles: "./src/styles/",
            $assets: "./src/assets/",
            "@": "./api/src/"
        }
    },

    preprocess: vitePreprocess()
};

export default config;
