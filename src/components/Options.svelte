<script>
    import { createEventDispatcher } from "svelte";
    import { get } from "svelte/store";
    import Dots from "../assets/icons/dots.svg";
    import ReloadIcon from "../assets/icons/reload.svg";
    import { config, scheduleParams, updateScheduleParams } from "../configStore";
    import { fetchCount } from "../mainStore";
    import { scheduleMetadata } from "../staticStore";
    import { readURL } from "../utilities";
    import Dropdown from "./Dropdown.svelte";

    import { browser } from "$app/environment";

    if (browser) window.addEventListener("popstate", () => updateScheduleParams(readURL(window.location)));

    let maxFetchCount;
    $: if ($scheduleParams.mode.id === "Permanent" || $scheduleParams.mode.id === "Other" || $config.useWeb === false) {
        maxFetchCount = 1;
    } else {
        maxFetchCount = 6;
    }

    const dispatch = createEventDispatcher();

    let dropdownOptions;
    $: dropdownOptions = {
        options: scheduleMetadata.classes,
        activeOption: scheduleMetadata.classes.search("id", $scheduleParams.class.id),
        callback: (val) => {
            let newParams = { class: val.name };
            if (get(scheduleParams).mode.id === "Other") newParams.mode = "Actual";
            updateScheduleParams(newParams);
            dropdownOptions.activeOption = scheduleMetadata.classes.search("id", $scheduleParams.class.id);
        },
        genericName: "name",
        genericKey: "id"
    };

    function setMode(mode) {
        updateScheduleParams({ mode });
    }

    function openModal() {
        dispatch("modalOpen", { type: "AdvancedSettingsModal" });
    }
</script>

<nav>
    <Dropdown {...dropdownOptions} />
    <div id="weekButtons">
        <button class:active={$scheduleParams.mode.id === "Permanent"} on:click={() => setMode("Permanent")}>Permanent</button>
        <button class:active={$scheduleParams.mode.id === "Actual"} on:click={() => setMode("Actual")}>Current</button>
        <button class:active={$scheduleParams.mode.id === "Next"} on:click={() => setMode("Next")}>Next</button>
        <button class:active={$scheduleParams.mode.id === "Other"} on:click={openModal}><Dots /></button>
    </div>
    <button id="reloadButton" class="styled-button" on:click={() => updateScheduleParams()}>
        <ReloadIcon />
        <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
    </button>
</nav>
