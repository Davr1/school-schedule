import { Plugin } from "vite";

/**
 * A custom Vite plugin that adds CSS colors to the global stylesheet
 */
export declare function customCssColorsPlugin(): Plugin;

/**
 * A custom Vite plugin that minifies the raw contents of a file with the `?raw&minify` query.
 *
 * Only supports JavaScript and CSS files.
 */
export function rawMinifyPlugin(): Plugin;
