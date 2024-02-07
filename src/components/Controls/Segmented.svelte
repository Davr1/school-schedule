<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { writable } from "svelte/store";

    import { controlValueKey } from "$components/Controls/Control.svelte";

    import styles from "$styles/modules/Controls.module.scss";

    type T = $$Generic;

    /**
     * The value of the selected control
     *
     * This is also passed to the children via context.
     */
    export let selection: T;

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

    // If the context is already set then throw an error (because these shouldn't be nested)
    if (getContext(controlValueKey)) throw new Error("Control groups cannot be nested");

    // Wrap the selection in a custom store so that it can be updated from children
    const selectionStore = writable(selection);
    if (!readonly) selectionStore.subscribe((val) => (selection = val));

    $: $selectionStore = selection;

    // Used by children to get the context
    // This allows them to target the correct control
    setContext(controlValueKey, readonly ? { subscribe: selectionStore.subscribe } : selectionStore);
</script>

<div class={styles.segmented} {id}>
    <slot />
</div>
