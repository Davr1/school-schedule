<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { writable } from "svelte/store";

    import { controlValueKey } from "$components/Controls/Control.svelte";

    import styles from "$styles/modules/Controls.module.scss";

    /**
     * The name of the selected control
     *
     * This is also passed to the children via context.
     */
    export let selection: string;

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
    selectionStore.subscribe((val) => (selection = val));
    $: $selectionStore = selection;

    // Used by children to get the context
    // This allows them to target the correct control
    setContext(controlValueKey, selectionStore);
</script>

<div class={styles.segmented} {id}>
    <slot />
</div>
