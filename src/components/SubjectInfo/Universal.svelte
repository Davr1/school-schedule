<script lang="ts">
    import { beforeUpdate } from "svelte";

    import { browser } from "$app/environment";
    import type { Subject } from "$lib/subject";
    import { getPosition } from "$lib/utilities";

    import SubjectInfoModal from "$components/SubjectInfo/Modal.svelte";
    import SubjectInfoPopover from "$components/SubjectInfo/Popover.svelte";

    /** Whether the modal / popover is visible */
    export let visible: boolean;

    /** The subject to show the info for */
    export let subject: Subject;

    /** The cell to show the popover for */
    export let cell: HTMLDivElement;

    /** Whether a popover can or cannot be shown */
    let canShowPopover = false;

    /** The position of the cell, can be undefined (but only if the modal is used) */
    let cellPosition: ReturnType<typeof getPosition>;

    // Check if a popover can be shown and recalculate the position before updating
    beforeUpdate(() => {
        // Don't run the check if visible is false
        if (!visible) return;

        canShowPopover = browser && window.innerWidth / window.innerHeight > 3 / 4;
        if (cell && canShowPopover) cellPosition = getPosition(cell);
    });
</script>

{#if canShowPopover && visible}
    <SubjectInfoPopover position={cellPosition} {subject} on:close={() => (visible = false)} />
{:else if !canShowPopover}
    <SubjectInfoModal bind:visible {subject} />
{/if}
