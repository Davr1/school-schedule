<script>
    import { createEventDispatcher } from "svelte";
    import Dots from "../assets/icons/dots.svg";
    import ReloadIcon from "../assets/icons/reload.svg";
    import { config, scheduleParams, updateScheduleParams } from "../configStore";
    import { fetchCount } from "../mainStore";
    import { scheduleMetadata, sheduleModes } from "../staticStore";
    import { readURL } from "../utilities";
    import Dropdown from "./Dropdown.svelte";

    import { browser } from "$app/environment";

    if (browser) window.addEventListener("popstate", () => updateScheduleParams(readURL(window.location)));

    let maxFetchCount;
    $: if ($scheduleParams.weekMode === "Permanent" || $scheduleParams.scheduleMode !== "Class" || $config.useWeb === false) {
        maxFetchCount = 1;
    } else {
        maxFetchCount = 6;
    }

    function getNewDropdownValues(mode) {
        return { Class: scheduleMetadata.classes, Teacher: scheduleMetadata.teachers, Room: scheduleMetadata.rooms }[mode];
    }

    const dispatch = createEventDispatcher();

    const indexedScheduleModes = sheduleModes.map((m) => ({ name: m, id: m }));
    let indexedScheduleValues = getNewDropdownValues($scheduleParams.scheduleMode);

    let modeDropdown;
    $: modeDropdown = {
        options: indexedScheduleModes,
        activeOption: indexedScheduleModes.search("id", $scheduleParams.scheduleMode, "Class"),
        callback: (val) => {
            updateScheduleParams({ scheduleMode: val.name });
            indexedScheduleValues = getNewDropdownValues($scheduleParams.scheduleMode);
            modeDropdown.activeOption = indexedScheduleModes.search("name", $scheduleParams.scheduleMode);
        },
        genericName: "name",
        genericKey: "id"
    };

    let valuesDropdown;
    $: valuesDropdown = {
        options: indexedScheduleValues,
        activeOption: indexedScheduleValues.search("name", $scheduleParams.value),
        callback: (val) => {
            updateScheduleParams({ value: val.name });
            valuesDropdown.activeOption = indexedScheduleValues.search("name", $scheduleParams.value);
        },
        genericName: "name",
        genericKey: "id"
    };

    function setMode(weekMode) {
        updateScheduleParams({ weekMode });
    }

    function openModal() {
        dispatch("modalOpen", { type: "AdvancedSettingsModal" });
    }
</script>

<nav>
    <Dropdown {...modeDropdown} />
    <Dropdown {...valuesDropdown} />
    <div id="weekButtons">
        <button class:active={$scheduleParams.weekMode === "Permanent"} on:click={() => setMode("Permanent")}>Permanent</button>
        <button class:active={$scheduleParams.weekMode === "Current"} on:click={() => setMode("Current")}>Current</button>
        <button class:active={$scheduleParams.weekMode === "Next"} on:click={() => setMode("Next")}>Next</button>
        <button on:click={openModal}><Dots /></button>
    </div>
    <button id="reloadButton" class="styled-button" on:click={() => updateScheduleParams()}>
        <ReloadIcon />
        <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
    </button>
</nav>
