<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { anchor } from "$lib/anchor";
    import { inert, portal } from "$lib/portal";

    import overlay from "$styles/modules/Overlay.module.scss";

    export let node: HTMLElement;

    let className: string | undefined = undefined;
    export { className as class };

    export let popover: HTMLDivElement | undefined = undefined;

    const dispatch = createEventDispatcher<{
        /** Called when the portal should be closed */
        close: null;
    }>();
</script>

<!--
    @component
    A popover that renders its children into a separate DOM node at the end of `document.body`.
    It also automatically positions itself relative to the given node.
-->

<!-- Close the popover on escape -->
<svelte:window
    on:keydown={($event) => {
        // If escape is pressed, dispatch a close event
        if ($event.key === "Escape") dispatch("close");
    }}
/>

<div class={overlay.overlay} on:click={() => dispatch("close")} role="presentation" use:portal use:inert>
    <div class={className} bind:this={popover} style:position="absolute" role="alertdialog" use:anchor={node}>
        <slot />
    </div>
</div>
