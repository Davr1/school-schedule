<script lang="ts">
    import { onMount } from "svelte";

    import Modal from "$components/Base/Modal.svelte";
    import Popover, { Anchor } from "$components/Base/Popover.svelte";

    import overlay from "$styles/modules/Overlay.module.scss";
    import styles from "$styles/modules/Schedule.module.scss";

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
    <Popover on:close {node} anchor={Anchor.Horizontal} class={`${styles.info} ${popoverClass}`.trim()} portalClass={overlay.overlay}>
        <slot />
    </Popover>
{:else}
    <Modal on:close>
        <slot />
    </Modal>
{/if}
