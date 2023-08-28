<script lang="ts">
    import { cls } from "$lib/class";

    import Close from "@material-design-icons/svg/filled/close.svg?component";

    import controlStyles from "$styles/modules/controls.module.scss";
    import styles from "$styles/modules/modal.module.scss";

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
<dialog class={cls(styles.modal, scrollable && styles.scrollable)} bind:this={dialog} on:close={hide} on:click|self={hide}>
    <button class={cls(controlStyles.button, styles.closeButton)} on:click={hide}>
        <Close />
    </button>

    <div class={styles.content}>
        <slot />
    </div>
</dialog>
