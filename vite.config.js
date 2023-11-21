import svg from "@poppanator/sveltekit-svg";
import { sveltekit } from "@sveltejs/kit/vite";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        // Disable dependency optimization for workspace packages
        exclude: ["@school-schedule/api"]
    },
    server: {
        // In dev mode, by default, the proxy and cache of the production server will be used.
        // Can be disabled by setting the environment variable LOCAL_PROXY to true
        proxy:
            process.env.LOCAL_PROXY === "true"
                ? {}
                : {
                      "/sssvt": {
                          target: "https://rozvrh.icy.cx",
                          changeOrigin: true
                      },
                      "/bakalari": {
                          target: "https://rozvrh.icy.cx",
                          changeOrigin: true
                      }
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
        })
    ],
    resolve: {
        alias: {
            $components: "/src/components",
            $stores: "/src/stores",
            $styles: "/src/styles",
            $assets: "/src/assets",
            "@/": "@school-schedule/api/src/"
        }
    },
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
