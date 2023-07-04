<script lang="ts">
    import { config } from "$stores/config";

    import LoadScreen from "$components/LoadScreen.svelte";
    import Options from "$components/Options.svelte";
    import ScheduleView from "$components/ScheduleView.svelte";

    let isLoadScreenVisible = $config.loadscreen;
</script>

{#if isLoadScreenVisible}
    <LoadScreen />
{/if}

<Options />
<ScheduleView
    on:loadingFinished={() => {
        isLoadScreenVisible = false;
    }}
/>
