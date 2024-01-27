<script lang="ts">
    import type { Cell } from "$lib/schedule";

    import NormalCell from "$components/Schedule/Cell/NormalCell.svelte";
    import RemovedCell from "$components/Schedule/Cell/RemovedCell.svelte";

    export let cell: Cell;

    export let row: number;

    $: y = row + cell.y;
</script>

{#if cell.isNormal()}
    <NormalCell {cell} {y} />
{:else if cell.isRemoved()}
    <RemovedCell {cell} {y} />
{/if}
