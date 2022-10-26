<script>
    import { createEventDispatcher } from "svelte";
    import Close from "../assets/icons/close.svg";

    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("hideScreenOverlay");
    }
</script>

<div id="modal">
    <button id="close-button" on:click={closeModal}><Close /></button>
    <slot />
</div>
