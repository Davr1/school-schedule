<script lang="ts">
    import Close from "@material-design-icons/svg/filled/close.svg?component";

    /** Whether the modal is visible */
    export let visible: boolean;

    /** Adds a scroll bar if this is true (I suppose?) */
    export let scrollable = false;

    /** Reference to the dialog DOM node */
    let dialog: HTMLDialogElement;

    // Show the modal when visible is true
    $: if (dialog && visible) dialog.showModal();

    // Hide the modal when visible is false
    $: if (dialog && !visible) dialog.close();

    /** Hide the overlay */
    const hide = () => (visible = false);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog class="modal" class:scrollable bind:this={dialog} on:close={hide} on:click|self={hide}>
    <button class="close-button" on:click={hide}>
        <Close />
    </button>

    <div class="modal-content">
        <slot />
    </div>
</dialog>
