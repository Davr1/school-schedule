<script lang="ts">
    import styles from "$styles/modules/Modal.module.scss";

    import Button from "$components/Controls/Button.svelte";
    import Close from "@material-design-icons/svg/filled/close.svg?component";

    /** Whether the modal is visible */
    export let visible: boolean;

    /** Adds a scroll bar if this is true (I suppose?) */
    export let scrollable = false;

    /** Reference to the dialog DOM node */
    let dialog: HTMLDialogElement;

    // Show the modal when visible is true (only if the dialog is closed)
    $: if (dialog && visible && !dialog.open) dialog.showModal();

    // Hide the modal when visible is false (only if the dialog is open)
    $: if (dialog && !visible && dialog.open) dialog.close();

    /** Hide the overlay */
    function hide() {
        dialog.close();
        visible = false;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog class={styles.modal} class:scrollable bind:this={dialog} on:close={hide} on:click|self={hide}>
    <div class={styles.content}>
        <Button class="big floating" on:click={() => (visible = false)}>
            <Close />
        </Button>
        <slot />
    </div>
</dialog>
