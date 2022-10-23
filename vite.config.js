import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteSVG } from "rollup-plugin-svelte-svg";
import sveltePreprocess from "svelte-preprocess";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            preprocess: sveltePreprocess()
        }),
        svelteSVG({
            svgo: {},
            enforce: "pre"
        })
    ]
});
