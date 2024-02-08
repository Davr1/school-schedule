<script lang="ts">
    import { browser } from "$app/environment";
    import { anchor } from "$lib/anchor";
    import { portal } from "$lib/portal";

    import { getContext, onDestroy, setContext } from "svelte";
    import { writable } from "svelte/store";

    import { addRipple } from "$lib/ripple";

    import ExpandMore from "@material-design-icons/svg/filled/expand_more.svg?component";

    import { controlValueKey } from "$components/Controls/Control.svelte";

    import styles from "$styles/modules/Controls.module.scss";

    type T = $$Generic;

    /**
     * The name of the selected control
     *
     * This is also passed to the children via context.
     */
    export let selection: T;

    /**
     * Whether the dropdown is visible
     */
    export let visible = false;

    /**
     * Should the selection be read-only
     *
     * This is used to prevent the selection from being changed by children
     *
     * Useful for when the selection is determined by the url for example
     */
    export let readonly = false;

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
    if (!readonly)
        selectionStore.subscribe((val) => {
            selection = val;
            visible = false;
        });

    $: $selectionStore = selection;

    // If the value is changed programmatically then close the dropdown
    $: selection, (visible = false);

    // Used by children to get the context
    // This allows them to target the correct control
    setContext(controlValueKey, readonly ? { subscribe: selectionStore.subscribe } : selectionStore);

    // Add event listeners to the app so it can be closed (ignore self)
    function close(e?: Event) {
        if (!browser || e?.target === button) return;

        if (e) visible = false;

        // Remove the event listener
        const app = document.getElementById("app");
        app?.removeEventListener("click", close);
        app?.removeEventListener("focusin", close);
    }

    $: {
        if (!browser || !visible) break $;

        const app = document.getElementById("app");

        setTimeout(() => {
            app?.addEventListener("click", close, { once: true });
            app?.addEventListener("focusin", close, { once: true });
        });
    }

    onDestroy(close);
</script>

<button bind:this={button} class={styles.dropdownButton} class:visible {id} use:addRipple on:click={() => (visible = !visible)}>
    <slot name="button">
        {selection}
    </slot>

    <ExpandMore />
</button>

<svelte:window on:keydown={(e) => e.key === "Escape" && (visible = false)} />

{#if visible}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div on:click={() => (visible = false)} class={styles.dropdown} role="alertdialog" use:anchor={button} use:portal>
        <slot />
    </div>
{/if}
