<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { writable } from "svelte/store";

    import { controlValueKey } from "$components/Controls/Control.svelte";

    import styles from "$styles/modules/controls.module.scss";

    /**
     * The name of the selected control
     *
     * This is also passed to the children via context.
     */
    export let selection = writable<string>();

    // If the context is already set then throw an error (because these shouldn't be nested)
    if (getContext(controlValueKey)) throw new Error("Control groups cannot be nested");

    // Used by children to get the context
    // This allows them to target the correct control
    setContext(controlValueKey, selection);
</script>

<div class={styles.segmented}>
    <span class={styles.selection} />

    <slot />
</div>
