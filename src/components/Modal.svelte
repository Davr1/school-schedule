<script>
    import { createEventDispatcher } from "svelte";

    import Close from "@material-design-icons/svg/filled/close.svg?component";

    export let scrollable = false;

    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("hideScreenOverlay");
    }
</script>

<div id="modal" class:scrollable>
    <button id="close-button" on:click={closeModal}><Close /></button>
    <div class="modal-content">
        <slot />
    </div>
</div>
