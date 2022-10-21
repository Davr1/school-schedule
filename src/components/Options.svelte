<script>
    import { fetchCount, scheduleParams, scheduleMetadata } from "../mainStore";
    import { readURL } from "../utilities";
    import { createEventDispatcher } from "svelte";
    import { get } from "svelte/store";
    import ReloadIcon from "../assets/icons/reload.svg";
    import Dropdown from "./Dropdown.svelte";
    import Dots from "../assets/icons/dots.svg";

    function updateScheduleParams(newParams = {}) {
        scheduleParams.update((o) => ({ ...o, ...newParams }));
        dropdownOptions.activeOption = $scheduleParams.class;
    }

    window.addEventListener("popstate", () => updateScheduleParams(readURL(window.location)));

    let maxFetchCount;
    $: maxFetchCount = $scheduleParams.mode === "Permanent" || $scheduleParams.mode === "Other" ? 1 : 6;

    const dispatch = createEventDispatcher();

    let dropdownOptions = {
        options: scheduleMetadata.classes,
        activeOption: $scheduleParams.class,
        callback: (val) => {
            let newParams = { class: val };
            if (get(scheduleParams).mode === "Other") newParams.mode = "Actual";
            updateScheduleParams(newParams);
        },
        genericName: "name",
        genericKey: "id"
    };
</script>

<nav>
    <Dropdown {...dropdownOptions} />
    <div id="weekButtons">
        <button class:active={$scheduleParams.mode === "Permanent"} on:click={() => updateScheduleParams({ mode: "Permanent" })}>
            Permanent
        </button>
        <button class:active={$scheduleParams.mode === "Actual"} on:click={() => updateScheduleParams({ mode: "Actual" })}>Current</button>
        <button class:active={$scheduleParams.mode === "Next"} on:click={() => updateScheduleParams({ mode: "Next" })}>Next</button>
        <button class:active={$scheduleParams.mode === "Other"} on:click={() => dispatch("modalOpen")}><Dots /></button>
    </div>
    <button id="reloadButton" on:click={() => updateScheduleParams()}>
        <ReloadIcon />
        <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
    </button>
</nav>
