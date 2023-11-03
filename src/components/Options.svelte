<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { writable } from "svelte/store";

    import { config, scheduleParams, updateScheduleParams, type ScheduleMode, type WeekMode } from "$stores/config";
    import { cache, fetchCount } from "$stores/main";
    import { scheduleMetadata, sheduleModes } from "$stores/static";

    import { addRipple } from "$lib/ripple";

    import MoreHoriz from "@material-design-icons/svg/filled/more_horiz.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import AdvancedSettingsModal from "$components/AdvancedSettingsModal.svelte";
    import Control from "$components/Controls/Control.svelte";
    import Segmented from "$components/Controls/Segmented.svelte";
    import Dropdown from "$components/Dropdown.svelte";

    import CacheButton from "$components/CacheButton.svelte";
    import controlStyles from "$styles/modules/Controls.module.scss";
    import styles from "$styles/modules/Options.module.scss";

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

<nav class={styles.options}>
    {#if !$cache}
        <Dropdown {...modeDropdown} />
    {/if}

    <Dropdown {...valuesDropdown} />

    {#if $cache}
        <CacheButton class={styles.cache} />

        <button class={controlStyles.button} on:click={() => (advancedSettingsModal = true)} use:addRipple>
            <MoreHoriz />
        </button>
    {:else}
        <Segmented bind:selection={scheduleMode} id="weekButtons">
            <Control name="Permanent" />
            <Control name="Current" />
            <Control name="Next" />

            <button class={controlStyles.button} on:click={() => (advancedSettingsModal = true)} use:addRipple>
                <MoreHoriz />
            </button>
        </Segmented>
    {/if}

    {#if !$cache}
        <button id="reloadButton" class={controlStyles.button} on:click={() => updateScheduleParams()} use:addRipple>
            <Refresh />
            <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
        </button>
    {/if}
</nav>

<AdvancedSettingsModal bind:visible={advancedSettingsModal} />
