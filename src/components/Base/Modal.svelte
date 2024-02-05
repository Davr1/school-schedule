<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import Close from "@material-design-icons/svg/filled/close.svg?component";

    import Portal from "$components/Base/Portal.svelte";
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

<Portal class={`${styles.overlay} ${overlay.overlay}`} on:close>
    <div class={styles.modal} class:scrollable role="presentation">
        <div class={styles.content}>
            <Button class="big floating" on:click={() => dispatch("close")}>
                <Close />
            </Button>

            <slot />
        </div>
    </div>
</Portal>
