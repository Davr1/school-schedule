<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { inert, portal } from "$lib/portal";

    import Close from "@material-design-icons/svg/filled/close.svg?component";

    import Button from "$components/Controls/Button.svelte";

    import styles from "$styles/modules/Modal.module.scss";
    import overlay from "$styles/modules/Overlay.module.scss";

    const dispatch = createEventDispatcher<{
        /** Called when the portal should be closed */
        close: null;
    }>();

    /** Adds a scroll bar if this is true (I suppose?) */
    export let scrollable = false;
</script>

<svelte:window
    on:keydown={($event) => {
        // If escape is pressed, dispatch a close event
        if ($event.key === "Escape") dispatch("close");
    }}
/>

<div class={`${styles.overlay} ${overlay.overlay}`} on:click|self={() => dispatch("close")} use:portal use:inert role="presentation">
    <div class={styles.modal} class:scrollable role="dialog">
        <div class={styles.content}>
            <Button class="big floating" on:click={() => dispatch("close")}>
                <Close />
            </Button>

            <slot />
        </div>
    </div>
</div>
