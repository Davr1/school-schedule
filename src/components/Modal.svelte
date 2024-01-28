<script lang="ts">
    import styles from "$styles/modules/Modal.module.scss";

    import Close from "@material-design-icons/svg/filled/close.svg?component";

    import Button from "$components/Controls/Button.svelte";
    import Portal from "$components/Portal.svelte";

    /** Whether the modal is visible */
    export let visible: boolean;

    /** Adds a scroll bar if this is true (I suppose?) */
    export let scrollable = false;

    /** Close the modal */
    function close() {
        visible = false;
    }
</script>

{#if visible}
    <Portal class={styles.overlay} on:close={close}>
        <div class={styles.modal} class:scrollable role="presentation">
            <div class={styles.content}>
                <Button class="big floating" on:click={close}>
                    <Close />
                </Button>

                <slot />
            </div>
        </div>
    </Portal>
{/if}
