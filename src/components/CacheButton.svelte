<script lang="ts">
    import { addRipple } from "$lib/ripple";

    import { updateScheduleParams } from "$stores/config";
    import { cache } from "$stores/main";

    import History from "@material-design-icons/svg/filled/history.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import controlStyles from "$styles/modules/Controls.module.scss";

    let className = "";
    export { className as class };

    function toggleCache() {
        $cache = !$cache;
        updateScheduleParams($cache ? { scheduleMode: "Class" } : undefined);
    }
</script>

<button class={`${controlStyles.button} ${className}`} on:click={toggleCache} use:addRipple>
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
</button>
