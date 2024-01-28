<script lang="ts">
    import type { Subject } from "$lib/subject";

    import Modal from "$components/Base/Modal.svelte";
    import Content from "$components/SubjectInfo/Content.svelte";

    /** The subject to show the info for */
    export let subject: Subject;

    /** Whether the SubjectInfoModal is visible */
    export let visible: boolean;
</script>

<Modal bind:visible on:hideScreenOverlay>
    <Content {subject} />
</Modal>
