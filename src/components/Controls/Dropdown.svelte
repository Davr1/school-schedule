<script lang="ts">
    import { getContext, setContext } from "svelte";

    import { browser } from "$app/environment";
    import { addRipple } from "$lib/ripple";
    import { getPosition } from "$lib/utilities";

    import ExpandMore from "@material-design-icons/svg/filled/expand_more.svg?component";

    import { controlValueKey } from "$components/Controls/Control.svelte";

    import styles from "$styles/modules/Controls.module.scss";
    import { writable } from "svelte/store";

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
    let top: string | undefined, bottom: string | undefined, transform: string, maxHeight: string;

    $: {
        if (!browser || !button) break $;

        if (visible) {
            const handleDropdownClicks = () => {
                document.removeEventListener("click", handleDropdownClicks);
                visible = false;
            };

            // Using setTimeout in order for it not to get triggered by the click that opened the dropdown
            setTimeout(() => document.addEventListener("click", handleDropdownClicks));
        }

        let position = getPosition(button);
        top = position.y > position.windowHeight * (3 / 4) ? "-0.4rem" : undefined;
        bottom = position.y < position.windowHeight * (3 / 4) ? "-0.4rem" : undefined;
        transform = position.y > position.windowHeight * (3 / 4) ? "translateY(-100%)" : "translateY(100%)";
        maxHeight =
            position.y > position.windowHeight * (3 / 4)
                ? `${position.size.top - position.containerSize.top - 40}px`
                : `${position.containerSize.bottom - position.size.bottom - 40}px`;
    }

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

<div class={styles.dropdown} class:visible>
    <button bind:this={button} class={styles.dropdownButton} {id} use:addRipple on:click={() => (visible = !visible)}>
        {selection}

        <ExpandMore />
    </button>

    {#if visible && button}
        <div class={styles.options} style:top style:bottom style:transform style:max-height={maxHeight}>
            <slot />
        </div>
    {/if}
</div>
