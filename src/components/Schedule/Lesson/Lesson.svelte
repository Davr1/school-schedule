<script lang="ts">
    import type { Lesson } from "@school-schedule/api/classes";

    import AbsenceLesson from "$components/Schedule/Lesson/AbsenceLesson.svelte";
    import NormalLesson from "$components/Schedule/Lesson/NormalLesson.svelte";
    import RemovedLesson from "$components/Schedule/Lesson/RemovedLesson.svelte";

    export let lesson: Lesson;

    export let row: number;
    export let column: number;

    $: bakalari = lesson.bakalari!;
</script>

{#if bakalari.isNormal()}
    <NormalLesson {bakalari} {row} {column} />
{:else if bakalari.isAbsence()}
    <AbsenceLesson {bakalari} {row} {column} />
{:else if bakalari.isRemoved()}
    <RemovedLesson {bakalari} {row} {column} />
{/if}
