<script lang="ts">
    import { config } from "$stores/config";

    import LoadScreen from "$components/LoadScreen.svelte";
    import Options from "$components/Options.svelte";
    import ScheduleView from "$components/ScheduleView.svelte";

    let isLoadScreenVisible = $config.loadscreen;
    let loading: boolean = true;
</script>

<LoadScreen visible={isLoadScreenVisible} {loading} />

<Options />
<ScheduleView
    on:state={({ detail }) => {
        loading = detail !== "finished";
        if (detail === "rendered") isLoadScreenVisible = false;
    }}
/>
