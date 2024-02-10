<script lang="ts">
    import type { RemovedCell } from "$lib/schedule";

    import { config } from "$stores/config";

    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    import Info from "$components/Schedule/Cell/Info/Info.svelte";

    export let cell: RemovedCell;
    export let node: HTMLElement;
</script>

<Info {node} on:close popoverClass="secondary">
    {#if $config.debug}
        <pre>{JSON.stringify(cell, null, 4)}</pre>
    {:else}
        <h2><TextSnippet /> {cell.name}</h2>
    {/if}
</Info>
