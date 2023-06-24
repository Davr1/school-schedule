// Import the version number from package.json.
// This is to avoid duplication of the version number in .env and package.json
import packageJson from "./package.json" assert { type: "json" };
import adapter from "@sveltejs/adapter-node";
import sveltePreprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        version: {
            name: packageJson.version
        }
    },
    preprocess: sveltePreprocess()
};

export default config;
