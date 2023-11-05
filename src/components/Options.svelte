<script lang="ts">
    import { config, scheduleParams } from "$stores/config";
    import { cache, fetchCount } from "$stores/main";
    import { scheduleMetadata, scheduleModes } from "$stores/static";

    import { addRipple } from "$lib/ripple";

    import MoreHoriz from "@material-design-icons/svg/filled/more_horiz.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import AdvancedSettingsModal from "$components/AdvancedSettingsModal.svelte";
    import Control from "$components/Controls/Control.svelte";
    import Dropdown from "$components/Controls/Dropdown.svelte";
    import Segmented from "$components/Controls/Segmented.svelte";

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

    let values: string[];
    $: switch ($scheduleParams.scheduleMode) {
        case "Class":
            values = scheduleMetadata.classes.map((c) => c.name);
            break;

        case "Teacher":
            values = scheduleMetadata.teachers.map((c) => c.name);
            break;

        case "Room":
            values = scheduleMetadata.rooms.map((c) => c.name);
            break;
    }
</script>

<nav class={styles.options} class:cache={$cache}>
    {#if !$cache}
        <Dropdown bind:selection={$scheduleParams.scheduleMode}>
            {#each scheduleModes as mode}
                <Control name={mode} />
            {/each}
        </Dropdown>
    {/if}

    <Dropdown bind:selection={$scheduleParams.value}>
        {#each values as value}
            <Control name={value} />
        {/each}
    </Dropdown>

    {#if !$cache}
        <Segmented bind:selection={$scheduleParams.weekMode} id="weekButtons">
            <Control name="Permanent" />
            <Control name="Current" />
            <Control name="Next" />

            <button class={controlStyles.button} on:click={() => (advancedSettingsModal = true)} use:addRipple>
                <MoreHoriz />
            </button>
        </Segmented>

        <button id="reloadButton" class={controlStyles.button} on:click={() => scheduleParams.update((_) => _)} use:addRipple>
            <Refresh />
            <span id="info">{$fetchCount} / {maxFetchCount} fetched</span>
        </button>
    {:else}
        <CacheButton class={styles.cache} />

        <button class={controlStyles.button} on:click={() => (advancedSettingsModal = true)} use:addRipple>
            <MoreHoriz />
        </button>
    {/if}
</nav>

<AdvancedSettingsModal bind:visible={advancedSettingsModal} />
