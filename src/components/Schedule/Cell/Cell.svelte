<script lang="ts">
    import { LessonType } from "@school-schedule/api/classes";

    import type { AnyCell } from "$lib/schedule";

    import NormalCell from "$components/Schedule/Cell/NormalCell.svelte";
    import RemovedCell from "$components/Schedule/Cell/RemovedCell.svelte";

    export let cell: AnyCell;
</script>

{#if cell.type === LessonType.Normal}
    <NormalCell {cell} />
{:else if cell.type === LessonType.Removed}
    <RemovedCell {cell} />
{/if}
