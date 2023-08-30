<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    import styles from "$styles/modules/dimOverlay.module.scss";

    /** Whether the overlay is shown or not */
    export let dimmed: boolean;

    const dispatch = createEventDispatcher<{
        /** Called when the overlay should be closed */
        close: null;
    }>();

    /** A reference to the overlay's DOM node */
    let overlay: HTMLDivElement;

    // On mount, add the element to the body
    onMount(() => document.body.appendChild(overlay));

    // On destroy, remove the element from the body
    onDestroy(() => overlay?.parentNode?.removeChild(overlay));
</script>

<!--
@component
A dimmed overlay that covers the entire screen.
Use z-index to place elements above it.

Usage:
  ```svelte
  <DimOverlay bind:dimmed={isDimmed} on:close={closeOverlay} />
  ```
-->

<svelte:window
    on:keydown={($event) => {
        // If escape is pressed, close the overlay
        if ($event.key === "Escape") dispatch("close");
    }}
/>

<div
    bind:this={overlay}
    role="presentation"
    class={styles.overlay}
    class:dimmed
    on:click={() => {
        // When the overlay is clicked, close it
        dispatch("close");
    }}
/>
