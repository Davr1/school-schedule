<script lang="ts" context="module">
    /**
     * The key for getting the value of the control
     */
    export const controlValueKey = Symbol("ControlValue");
</script>

<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    import { addRipple } from "$lib/ripple";

    import styles from "$styles/modules/Controls.module.scss";

    type T = $$Generic;

    /**
     * The value to use, this will what the selection is set to when the control is clicked
     *
     * When no slot is provided this will also be used as the slot content (may cause issues, use with caution)
     */
    export let value: T;

    const selection = getContext<Writable<T>>(controlValueKey);

    // If the context is not set then throw an error as this control is not a child of a control group
    if (!selection) throw new Error("Control must be a child of a control group");

    let button: HTMLButtonElement;

    // Scroll into view when the control is selected
    $: if ($selection === value) button?.scrollIntoView({ block: "center" });

    // Whether the control group is read-only
    $: readonly = "set" in selection;
</script>

<button
    class={styles.control}
    class:active={$selection === value}
    on:click={() => !readonly && ($selection = value)}
    on:click
    use:addRipple
    bind:this={button}
>
    <slot>{value}</slot>
</button>
