<script lang="ts">
    import { scheduleParams } from "$stores/config";
    import { cache } from "$stores/main";

    import Button from "$components/Controls/Button.svelte";
    import History from "@material-design-icons/svg/filled/history.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    let className = "";
    export { className as class };

    function toggleCache() {
        $cache = !$cache;

        if ($cache) $scheduleParams.scheduleMode = "Class";
        else scheduleParams.update((_) => _);
    }
</script>

<Button class={className} on:click={toggleCache}>
    {#if $cache}
        <Refresh />
    {:else}
        <History />
    {/if}

    Load schedule from
    {#if $cache}
        Bakalari
    {:else}
        cache
    {/if}
</Button>
