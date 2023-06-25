import svg from "@poppanator/sveltekit-svg";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        sveltekit(),
        svg({
            svgoOptions: {
                multipass: true,
                plugins: [
                    {
                        name: "preset-default",
                        // by default svgo removes the viewBox which prevents svg icons from scaling
                        // not a good idea! https://github.com/svg/svgo/pull/1461
                        params: { overrides: { removeViewBox: false } }
                    },
                    // Add fill="currentColor" to all svg elements so it can be recolored with css
                    { name: "addAttributesToSVGElement", params: { attributes: [{ fill: "currentColor" }] } }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            $components: "/src/components",
            $stores: "/src/stores",
            $styles: "/src/styles",
            $assets: "/src/assets"
        }
    }
});
