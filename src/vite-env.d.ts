/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module "*?raw&minify" {
    const content: string;
    export default content;
}
