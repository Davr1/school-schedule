import svg from "@poppanator/sveltekit-svg";
import { customCssColorsPlugin, rawMinifyPlugin } from "@school-schedule/vite-plugins";
import { sveltekit } from "@sveltejs/kit/vite";
import autoprefixer from "autoprefixer";
import { defineConfig, searchForWorkspaceRoot } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        // Disable dependency optimization for workspace packages
        exclude: ["@school-schedule/api"]
    },
    server: {
        fs: {
            allow: [searchForWorkspaceRoot(process.cwd())]
        }
    },
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
        }),
        customCssColorsPlugin(),
        rawMinifyPlugin()
    ],
    css: {
        modules: {
            // By default, all class names in your components will be passed through to the final bundle.
            // for the hashed class names, add a :local modifier to the class name (e.g. :local(.foo) { ... })
            scopeBehaviour: "global"
        },

        postcss: {
            plugins: [autoprefixer()]
        }
    },
    build: {
        sourcemap: true
    }
});
