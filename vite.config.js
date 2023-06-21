import { sveltekit } from "@sveltejs/kit/vite";
import { svelteSVG } from "rollup-plugin-svelte-svg";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        sveltekit(),
        svelteSVG({
            svgo: {},
            enforce: "pre"
        })
    ]
});
