<script>
    import Options from "./components/Options.svelte";
    import ScheduleView from "./components/ScheduleView.svelte";
    import LoadScreen from "./components/LoadScreen.svelte";
    import { scheduleParams } from "./mainStore";
    import { setURL } from "./utilities";

    scheduleParams.subscribe((v) => setURL("/", { [v.mode]: "", cls: v.class?.name }));

    let isLoadScreenVisible = true;
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
