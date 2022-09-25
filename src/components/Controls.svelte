<script>
    import { fetchCount, scheduleParams } from "../mainStore";
    import ReloadIcon from "../assets/icons/reload.svg";
    import ClassSelection from "./ClassSelection.svelte";

    function updateScheduleParams(newParams = {}) {
        scheduleParams.update((o) => ({ ...o, ...newParams }));
    }
</script>

<nav>
    <ClassSelection />
    <div id="weekButtons">
        <button class:active={$scheduleParams.mode === "Permanent"} on:click={() => updateScheduleParams({ mode: "Permanent" })}>
            Permanent
        </button>
        <button class:active={$scheduleParams.mode === "Actual"} on:click={() => updateScheduleParams({ mode: "Actual" })}>Current</button>
        <button class:active={$scheduleParams.mode === "Next"} on:click={() => updateScheduleParams({ mode: "Next" })}>Next</button>
    </div>
    <button id="reload" on:click={() => updateScheduleParams()}>
        <ReloadIcon />
        <span id="info">{$fetchCount} / 6 fetched</span>
    </button>
</nav>
