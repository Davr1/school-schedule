/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module "*.svg" {
    import { SvelteComponent } from "svelte";

    export default SvelteComponent;
}
