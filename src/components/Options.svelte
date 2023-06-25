<script>
    import { createEventDispatcher } from "svelte";

    import { config, scheduleParams, updateScheduleParams } from "$stores/config";
    import { fetchCount } from "$stores/main";
    import { scheduleMetadata, sheduleModes } from "$stores/static";

    import MoreHoriz from "@material-design-icons/svg/filled/more_horiz.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import Dropdown from "$components/Dropdown.svelte";

    // if (browser) window.addEventListener("popstate", () => updateScheduleParams(readURL(window.location)));

    let maxFetchCount;
    $: if ($scheduleParams.weekMode === "Permanent" || $scheduleParams.scheduleMode !== "Class" || $config.useWeb === false) {
        maxFetchCount = 1;
    } else {
        maxFetchCount = 6;
    }

    function getDropdownValues(mode) {
        let options = { Class: scheduleMetadata.classes, Teacher: scheduleMetadata.teachers, Room: scheduleMetadata.rooms }[mode];
        return {
            options,
            activeOption: options.search("name", $scheduleParams.value),
            callback: (val) => {
                updateScheduleParams({ value: val.name });
                valuesDropdown.activeOption = options.search("name", $scheduleParams.value);
            },
            genericName: "name",
            genericKey: "id"
        };
    }

    const dispatch = createEventDispatcher();

    const indexedScheduleModes = sheduleModes.map((m) => ({ name: m, id: m }));

    let modeDropdown;
    $: modeDropdown = {
        options: indexedScheduleModes,
        activeOption: indexedScheduleModes.search("id", $scheduleParams.scheduleMode, "Class"),
        callback: (val) => {
            updateScheduleParams({ scheduleMode: val.name });
            modeDropdown.activeOption = indexedScheduleModes.search("name", $scheduleParams.scheduleMode);
        },
        genericName: "name",
        genericKey: "id"
    };

    let valuesDropdown;
    $: valuesDropdown = getDropdownValues($scheduleParams.scheduleMode);

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
        <button on:click={openModal}><MoreHoriz /></button>
    </div>
    <button id="reloadButton" class="styled-button" on:click={() => updateScheduleParams()}>
        <Refresh />
        <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
    </button>
</nav>
