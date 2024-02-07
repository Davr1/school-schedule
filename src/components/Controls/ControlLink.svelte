<script lang="ts">
    import { controlValueKey } from "$components/Controls/Control.svelte";

    import { getContext } from "svelte";
    import type { Readable } from "svelte/store";

    import { addRipple } from "$lib/ripple";

    import styles from "$styles/modules/Controls.module.scss";

    type T = $$Generic;

    /**
     * The value to use for checking if the control is selected.
     *
     * Note that this will not change the selection, the selection should be determined from the url.
     *
     * When no slot is provided this will also be used as the slot content (`.toString()` will be called on it)
     */
    export let value: T;

    /**
     * Href to navigate to when the control is clicked
     */
    export let href: string;

    const selection = getContext<Readable<T>>(controlValueKey);

    // If the context is not set then throw an error as this control is not a child of a control group
    if (!selection) throw new Error("ControlLink must be a child of a control group");

    let link: HTMLAnchorElement;

    // Scroll into view when the control is selected
    $: if ($selection === value) link?.scrollIntoView({ block: "center" });
</script>

<a {href} class={styles.control} class:active={$selection === value} use:addRipple bind:this={link} data-sveltekit-preload-data="off">
    <slot>{value}</slot>
</a>
