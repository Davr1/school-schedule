<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { writable } from "svelte/store";

    import { addRipple } from "$lib/ripple";

    import ExpandMore from "@material-design-icons/svg/filled/expand_more.svg?component";

    import Popover, { Anchor } from "$components/Base/Popover.svelte";
    import { controlValueKey } from "$components/Controls/Control.svelte";

    import styles from "$styles/modules/Controls.module.scss";

    /**
     * The name of the selected control
     *
     * This is also passed to the children via context.
     */
    export let selection: string;

    /**
     * Whether the dropdown is visible
     */
    export let visible = false;

    /**
     * Optional id for the control group
     *
     * Doesn't have any effect, just makes it easier to style
     */
    export let id: string | undefined = undefined;

    /**
     * The button for the dropdown
     */
    let button: HTMLButtonElement;

    // If the context is already set then throw an error (because these shouldn't be nested)
    if (getContext(controlValueKey)) throw new Error("Control groups cannot be nested");

    // Wrap the selection in a custom store so that it can be updated from children
    const selectionStore = writable(selection);
    selectionStore.subscribe((val) => {
        selection = val;
        visible = false;
    });

    $: $selectionStore = selection;

    // Used by children to get the context
    // This allows them to target the correct control
    setContext(controlValueKey, selectionStore);

    /**
     * What the `visible` variable will be set to on click
     *
     * This is used to prevent the dropdown from reopening when the button is clicked while the dropdown is open
     */
    let onclick = true;
</script>

<button
    bind:this={button}
    class={styles.dropdownButton}
    class:visible
    {id}
    use:addRipple
    on:click={() => (onclick ? (visible = true) : (onclick = true))}
    on:focus={() => visible && (onclick = false)}
>
    {selection}

    <ExpandMore />
</button>

{#if visible}
    <Popover node={button} on:close={() => (visible = false)} anchor={Anchor.Vertical} inert={false} class={styles.dropdown}>
        <slot />
    </Popover>
{/if}
