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

    /**
     * The name to use, this will be used as the value when selected
     *
     * When no slot is provided this will also be used as the slot content
     */
    export let name: string;

    const value = getContext<Writable<string>>(controlValueKey);

    // If the context is not set then throw an error as this control is not a child of a control group
    if (!value) throw new Error("Control must be a child of a control group");
</script>

<button class={styles.control} class:active={$value === name} on:click={() => ($value = name)} use:addRipple>
    <slot>{name}</slot>
</button>
