<script>
    import Options from "./components/Options.svelte";
    import ScheduleView from "./components/ScheduleView.svelte";
    import LoadScreen from "./components/LoadScreen.svelte";
    import { scheduleParams, isSubjectInfoVisible } from "./mainStore";
    import { setURL } from "./utilities";

    scheduleParams.subscribe((v) =>
        setURL("/", v.mode !== "Other" ? { [v.mode]: "", cls: v.class?.name } : { Other: "", type: v.type, value: v.value })
    );

    let isLoadScreenVisible = true;
    let isBackgroundDimmed = false;

    isSubjectInfoVisible.subscribe((value) => {
        isBackgroundDimmed = value;
    });

    function hideScreenOverlay() {
        isBackgroundDimmed = false;
        isSubjectInfoVisible.set(false);
    }

    function loadingFinished() {
        isLoadScreenVisible = false;
        isBackgroundDimmed = false;
        isSubjectInfoVisible.set(false);
    }
</script>

{#if isLoadScreenVisible}
    <LoadScreen />
{/if}
<div id="dim-overlay" class:dimmed={isBackgroundDimmed} on:click={hideScreenOverlay} />
<Options />
<ScheduleView on:loadingFinished={loadingFinished} />
