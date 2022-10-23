<script>
    import { config, scheduleParams, updateScheduleParams } from "../configStore";
    import { scheduleMetadata, modes } from "../staticStore";
    import { setURL } from "../utilities";
    import { createEventDispatcher } from "svelte";
    import Switch from "./Switch.svelte";
    import Dropdown from "./Dropdown.svelte";
    import Modal from "./Modal.svelte";
    import Uwu from "../assets/uwu.svg";
    import Close from "../assets/icons/close.svg";

    const dispatch = createEventDispatcher();

    let { updateURL, keepState, useWeb, sundayOverride, loadscreen } = $config;

    // URL update
    $: {
        $config.updateURL = updateURL;
        if (!updateURL) {
            window.history.pushState(null, "", location.origin);
        } else {
            let params = $scheduleParams;
            setURL(
                "/",
                params.mode.id !== "Other"
                    ? { [params.mode.name]: "", cls: params.class.name }
                    : { Other: "", type: params.type, value: params.value }
            );
        }
    }

    // keep state
    $: $config.keepState = keepState;

    // use school website
    $: $config.useWeb = useWeb;

    // Sunday override
    $: $config.sundayOverride = sundayOverride;

    // load screen
    $: $config.loadscreen = loadscreen;

    // dropdowns
    let classDropdownOptions, modeDropdownOptions, specialModeDropdownOptions, specialValueDropdownOptions;

    classDropdownOptions = {
        options: scheduleMetadata.classes,
        activeOption: $scheduleParams.class,
        callback: (val) => {
            classDropdownOptions.activeOption = val;
        },
        genericName: "name",
        genericKey: "id"
    };

    modeDropdownOptions = {
        options: modes,
        activeOption: modes.find((a) => a.id === $scheduleParams.mode.id),
        callback: (val) => {
            modeDropdownOptions.activeOption = val;
        },
        genericName: "name",
        genericKey: "id"
    };

    let specialModeOptions = [
        { name: "Teacher", id: "teacher" },
        { name: "Room", id: "room" }
    ];
    specialModeDropdownOptions = {
        options: specialModeOptions,
        activeOption: specialModeOptions.search("id", scheduleMetadata.type, "teacher"),
        callback: (val) => {
            specialModeDropdownOptions.activeOption = val;
        },
        genericName: "name",
        genericKey: "id"
    };

    $: specialValueDropdownOptions = {
        options: specialModeDropdownOptions.activeOption.id === "teacher" ? scheduleMetadata.teachers : scheduleMetadata.rooms,
        activeOption:
            specialModeDropdownOptions.activeOption.id === "teacher"
                ? scheduleMetadata.teachers.search("abbr", $scheduleParams.value, "An")
                : scheduleMetadata.rooms.search("abbr", $scheduleParams.value, "01"),
        callback: (val) => {
            specialValueDropdownOptions.activeOption = val;
        },
        genericName: "name",
        genericKey: "abbr"
    };

    function saveOptions() {
        updateScheduleParams({
            class: classDropdownOptions.activeOption.name,
            mode: modeDropdownOptions.activeOption.name,
            type: specialModeDropdownOptions.activeOption.id,
            value: specialValueDropdownOptions.activeOption.abbr
        });
    }

    function closeModal() {
        dispatch("hideScreenOverlay");
    }
</script>

<Modal>
    <button id="close-button" on:click={closeModal}><Close /></button>
    <h1>Schedule</h1>
    <div class="option-row">Mode <Dropdown {...modeDropdownOptions} /></div>
    <div class="option-row" class:disabled={modeDropdownOptions.activeOption.id === "Other"}>
        Class <Dropdown {...classDropdownOptions} />
    </div>
    <div class="option-row" class:disabled={modeDropdownOptions.activeOption.id !== "Other"}>
        Special mode <Dropdown {...specialModeDropdownOptions} />
    </div>
    <div class="option-row" class:disabled={modeDropdownOptions.activeOption.id !== "Other"}>
        Special mode value <Dropdown {...specialValueDropdownOptions} />
    </div>
    <div class="option-row right-aligned">
        <button class="styled-button" on:click={saveOptions}>Apply</button>
    </div>
    <h1>Advanced settings</h1>
    <div class="option-row">Display current schedule options in the URL <Switch bind:value={updateURL} /></div>
    <p>
        <span>When enabled, schedule options will be automatically appended to the url as parameters.</span>
        <span>Allows for easier sharing and browser history traversing.</span>
    </p>
    <div class="option-row">Save last selected schedule options <Switch bind:value={keepState} /></div>
    <p>
        <span>Schedule options will be saved in the browser's local storage.</span>
        <span>They will be used as the defaults when you visit the base domain.</span>
    </p>
    <div class="option-row">Use the school's website for substitutions <Switch bind:value={useWeb} /></div>
    <p>
        <span>Substituted classes taken from the school's website will be merged with the full schedule.</span>
    </p>
    <div class="option-row">Show next week on Sunday <Switch bind:value={sundayOverride} /></div>
    <p>
        <span>The current schedule will show the next week's schedule on Sundays.</span>
    </p>
    <div class="option-row">
        <span><Uwu height="1em" style="vertical-align: sub;" /> loading screen</span>
        <Switch bind:value={loadscreen} />
    </div>
    <p><span>What's this?</span></p>
</Modal>
