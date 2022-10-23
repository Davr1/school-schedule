<script>
    import { fetchCount } from "../mainStore";
    import { scheduleMetadata } from "../staticStore";
    import { config, scheduleParams, updateScheduleParams } from "../configStore";
    import { readURL } from "../utilities";
    import { createEventDispatcher } from "svelte";
    import { get } from "svelte/store";
    import ReloadIcon from "../assets/icons/reload.svg";
    import Dropdown from "./Dropdown.svelte";
    import Dots from "../assets/icons/dots.svg";

    window.addEventListener("popstate", () => {
        alert(1);
        updateScheduleParams(readURL(window.location));
    });

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
</script>

<nav>
    <Dropdown {...dropdownOptions} />
    <div id="weekButtons">
        <button class:active={$scheduleParams.mode.id === "Permanent"} on:click={() => setMode("Permanent")}>Permanent</button>
        <button class:active={$scheduleParams.mode.id === "Actual"} on:click={() => setMode("Actual")}>Current</button>
        <button class:active={$scheduleParams.mode.id === "Next"} on:click={() => setMode("Next")}>Next</button>
        <button class:active={$scheduleParams.mode.id === "Other"} on:click={() => dispatch("modalOpen")}><Dots /></button>
    </div>
    <button id="reloadButton" class="styled-button" on:click={() => updateScheduleParams()}>
        <ReloadIcon />
        <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
    </button>
</nav>
