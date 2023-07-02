<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { createEventDispatcher } from "svelte";

    import { config, type ScheduleMode, scheduleParams, updateScheduleParams } from "$stores/config";
    import { fetchCount } from "$stores/main";
    import { scheduleMetadata, sheduleModes } from "$stores/static";

    import MoreHoriz from "@material-design-icons/svg/filled/more_horiz.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import Dropdown from "$components/Dropdown.svelte";

    let maxFetchCount: number;
    $: if ($scheduleParams.weekMode === "Permanent" || $scheduleParams.scheduleMode !== "Class" || $config.useWeb === false) {
        maxFetchCount = 1;
    } else {
        maxFetchCount = 6;
    }

    type ValuesDropdown = (typeof scheduleMetadata)[keyof typeof scheduleMetadata][number];
    function getDropdownValues(mode: ScheduleMode): ComponentProps<Dropdown<ValuesDropdown>> {
        let options = {
            Class: scheduleMetadata.classes,
            Teacher: scheduleMetadata.teachers,
            Room: scheduleMetadata.rooms
        }[mode] as readonly ValuesDropdown[];

        return {
            options,
            activeOption: options.find((v) => v.name === $scheduleParams.value)!,
            callback: (val) => {
                updateScheduleParams({ value: val.name });
                valuesDropdown.activeOption = options.find((v) => v.name === $scheduleParams.value)!;
            },
            genericName: "name",
            genericKey: "id"
        };
    }

    const dispatch = createEventDispatcher<{ modalOpen: { type: "AdvancedSettingsModal" } }>();

    type ModeDropdown = { mode: (typeof sheduleModes)[number] };
    let modeDropdown: ComponentProps<Dropdown<ModeDropdown>>;
    $: modeDropdown = {
        options: sheduleModes.map((m) => ({ mode: m })),
        activeOption: { mode: $scheduleParams.scheduleMode },
        callback: (val) => {
            updateScheduleParams({ scheduleMode: val.mode });
            modeDropdown.activeOption = { mode: $scheduleParams.scheduleMode };
        },
        genericName: "mode",
        genericKey: "mode"
    };

    let valuesDropdown: ComponentProps<Dropdown<ValuesDropdown>>;
    $: valuesDropdown = getDropdownValues($scheduleParams.scheduleMode);

    function setMode(weekMode: "Permanent" | "Current" | "Next") {
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
