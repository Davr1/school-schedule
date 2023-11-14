<script lang="ts">
    import { config, possibleValues, scheduleParams } from "$stores/config";
    import { cache, fetchCount } from "$stores/main";
    import { scheduleModes } from "$stores/static";

    import MoreHoriz from "@material-design-icons/svg/filled/more_horiz.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import AdvancedSettingsModal from "$components/AdvancedSettingsModal.svelte";
    import CacheButton from "$components/CacheButton.svelte";
    import Button from "$components/Controls/Button.svelte";
    import Control from "$components/Controls/Control.svelte";
    import Dropdown from "$components/Controls/Dropdown.svelte";
    import Segmented from "$components/Controls/Segmented.svelte";

    import styles from "$styles/modules/Options.module.scss";

    /** Whether the advanced settings modal is visible, false by default */
    let advancedSettingsModal = false;

    let maxFetchCount: number;
    $: if ($scheduleParams.weekMode === "Permanent" || $scheduleParams.scheduleMode !== "Class" || $config.useWeb === false) {
        maxFetchCount = 1;
    } else {
        maxFetchCount = 6;
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
        {#each possibleValues[$scheduleParams.scheduleMode] as value}
            <Control name={value} />
        {/each}
    </Dropdown>

    {#if !$cache}
        <Segmented bind:selection={$scheduleParams.weekMode} id="weekButtons">
            <Control name="Permanent" />
            <Control name="Current" />
            <Control name="Next" />

            <Button on:click={() => (advancedSettingsModal = true)}>
                <MoreHoriz />
            </Button>
        </Segmented>

        <Button on:click={() => scheduleParams.update((_) => _)}>
            <Refresh />
            <span id="info">{Math.min($fetchCount, maxFetchCount)} / {maxFetchCount} fetched</span>
        </Button>
    {:else}
        <CacheButton class={styles.cache} />

        <Button on:click={() => (advancedSettingsModal = true)}>
            <MoreHoriz />
        </Button>
    {/if}
</nav>

<AdvancedSettingsModal bind:visible={advancedSettingsModal} />
