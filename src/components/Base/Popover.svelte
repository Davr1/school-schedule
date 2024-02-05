<script lang="ts" context="module">
    export enum Anchor {
        Horizontal,
        Vertical
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";

    import Portal from "$components/Base/Portal.svelte";

    export let node: HTMLElement;
    export let anchor: Anchor;
    export let inert = true;

    export let portalClass: string | undefined = undefined;
    let className: string | undefined = undefined;
    export { className as class };

    export let popover: HTMLDivElement | undefined = undefined;

    /** Update the position of the popover */
    function update() {
        if (!popover) return;

        const pos = node.getBoundingClientRect();

        if (anchor === Anchor.Horizontal) {
            const wSize = window.innerWidth;
            const wMid = wSize / 2;

            if (Math.abs(pos.left - wMid) < Math.abs(pos.right - wMid)) {
                popover.style.right = wSize - pos.left + "px";
                popover.style.left = "auto";
                popover.style.setProperty("--max-width", pos.left + "px");
            } else {
                popover.style.left = pos.right + "px";
                popover.style.right = "auto";
                popover.style.setProperty("--max-width", wSize - pos.right + "px");
            }

            popover.style.top = pos.top + "px";
        }

        // Anchor.Vertical
        else {
            const wSize = window.innerHeight;
            const wMid = wSize / 2;

            if (Math.abs(pos.top - wMid) < Math.abs(pos.bottom - wMid)) {
                popover.style.bottom = wSize - pos.top + "px";
                popover.style.top = "auto";
                popover.style.setProperty("--max-height", pos.top + "px");
            } else {
                popover.style.top = pos.bottom + "px";
                popover.style.bottom = "auto";
                popover.style.setProperty("--max-height", wSize - pos.bottom + "px");
            }

            popover.style.left = pos.left + "px";
        }
    }

    // Get the position of the node on mount
    onMount(update);
</script>

<!--
    @component
    A popover that renders its children into a separate DOM node at the end of `document.body`.
    It also automatically positions itself relative to the given node.

    The `anchor` prop is used to determine whether it should be positioned horizontally or vertically.

    On the element itself, it sets position to `absolute` and sets the `--max-width` or `--max-height` CSS variable
    You can work with these variables to make sure the popover doesn't go off-screen.
    The `--max-width` variable is used when `anchor` is `Anchor.Horizontal`, and `--max-height` when `Anchor.Vertical`.
    `left`, `right`, `top` and `bottom` are set automatically, so you don't need to worry about those.
-->

<!-- Update the position on resize, and close the popover on click anywhere else -->
<svelte:window on:resize={update} />

<Portal class={portalClass} on:close {inert}>
    <div class={className} bind:this={popover} style:position="absolute">
        <slot />
    </div>
</Portal>
