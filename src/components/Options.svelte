<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { writable } from "svelte/store";

    import { config, type ScheduleMode, scheduleParams, updateScheduleParams, type WeekMode } from "$stores/config";
    import { fetchCount } from "$stores/main";
    import { scheduleMetadata, sheduleModes } from "$stores/static";

    import MoreHoriz from "@material-design-icons/svg/filled/more_horiz.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import AdvancedSettingsModal from "$components/AdvancedSettingsModal.svelte";
    import Button from "$components/Controls/Button.svelte";
    import Control from "$components/Controls/Control.svelte";
    import Segmented from "$components/Controls/Segmented.svelte";
    import Dropdown from "$components/Dropdown.svelte";

    /** Whether the advanced settings modal is visible, false by default */
    let advancedSettingsModal = false;

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

    // NOTE: Consider changing this. This is kinda dumb....
    let scheduleMode = writable<WeekMode>($scheduleParams.weekMode);
    scheduleMode.subscribe((weekMode) => updateScheduleParams({ weekMode }));
</script>

<nav>
    <Dropdown {...modeDropdown} />
    <Dropdown {...valuesDropdown} />

    <Segmented bind:selection={scheduleMode}>
        <Control name="Permanent" />
        <Control name="Current" />
        <Control name="Next" />

        <Button on:click={() => (advancedSettingsModal = true)}><MoreHoriz /></Button>
    </Segmented>

    <Button id="reloadButton" on:click={() => updateScheduleParams()}>
        <Refresh />
        <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
    </Button>
</nav>

<AdvancedSettingsModal bind:visible={advancedSettingsModal} />
