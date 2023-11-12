<script lang="ts">
    import { config } from "$stores/config";

    import LoadScreen from "$components/LoadScreen.svelte";
    import Options from "$components/Options.svelte";
    import ScheduleView from "$components/ScheduleView.svelte";
    import Favicon from "$components/Favicon.svelte";

    let isLoadScreenVisible = $config.loadscreen;
    let loading: boolean;
</script>

<div><Favicon {loading} /></div>

{#if isLoadScreenVisible}
    <LoadScreen />
{/if}

<Options />
<ScheduleView
    on:state={({ detail }) => {
        loading = detail !== "finished";
        if (detail === "rendered") isLoadScreenVisible = false;
    }}
/>
