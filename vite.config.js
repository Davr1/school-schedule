import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { sass } from "svelte-preprocess-sass";
import { svelteSVG } from "rollup-plugin-svelte-svg";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: {
        style: sass(),
      },
    }),
    svelteSVG({
      svgo: {},
      enforce: "pre",
    }),
  ],
});
