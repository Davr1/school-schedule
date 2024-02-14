<script lang="ts">
    import { onMount } from "svelte";

    import Modal from "$components/Modal.svelte";
    import Popover from "$components/Popover.svelte";

    import styles from "$styles/modules/Schedule/Info.module.scss";

    /** DOM node for the popover, will be ignored by the modal */
    export let node: HTMLElement;

    // Styling purposes
    export let popoverClass: string = "";

    /** Whether the popover or modal should be used */
    let desktop = false;

    // Update the state of `desktop` on mount and before update to check if the popover should be used
    function update() {
        desktop = window.innerWidth / window.innerHeight > 3 / 4;
    }

    onMount(update);
</script>

<svelte:window on:resize={update} />

{#if desktop}
    <Popover on:close {node} class={`${styles.info} ${popoverClass}`.trim()}>
        <slot />
    </Popover>
{:else}
    <Modal on:close>
        <slot />
    </Modal>
{/if}
