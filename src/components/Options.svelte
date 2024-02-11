<script lang="ts" context="module">
    import { Week } from "@/loader/bakalari";
    import { DetailHandler, DetailType, type Detail } from "@school-schedule/api/classes";

    const values = {
        [DetailType.Class]: DetailHandler.instance.getOfType(DetailType.Class),
        [DetailType.Teacher]: DetailHandler.instance.getOfType(DetailType.Teacher),
        [DetailType.Room]: DetailHandler.instance.getOfType(DetailType.Room).sort((a, b) => Number(a.name) - Number(b.name))
    } as Record<DetailType, Detail[]>;
</script>

<script lang="ts">
    import { TeacherDetail } from "@school-schedule/api/classes";

    import { invalidateAll } from "$app/navigation";

    import MoreHoriz from "@material-design-icons/svg/filled/more_horiz.svg?component";
    import Refresh from "@material-design-icons/svg/filled/refresh.svg?component";

    import AdvancedSettingsModal from "$components/AdvancedSettingsModal.svelte";
    import Button from "$components/Controls/Button.svelte";
    import ControlLink from "$components/Controls/ControlLink.svelte";
    import Dropdown from "$components/Controls/Dropdown.svelte";
    import Segmented from "$components/Controls/Segmented.svelte";

    import styles from "$styles/modules/Options.module.scss";

    /** Whether the advanced settings modal is visible, false by default */
    let advancedSettingsModal = false;

    export let week: Week;
    export let detail: Detail;

    $: mode = detail.type;
</script>

<nav class={styles.options}>
    <Dropdown selection={mode} readonly>
        <ControlLink value={DetailType.Class} href="./P3.B" />
        <ControlLink value={DetailType.Teacher} href="./masek" />
        <ControlLink value={DetailType.Room} href="./104" />
    </Dropdown>

    <Dropdown selection={detail} readonly>
        {#each values[mode] as value}
            <ControlLink {value} href="./{value.name}">
                {value instanceof TeacherDetail ? value.reverseName : value.name}
            </ControlLink>
        {/each}

        <svelte:fragment slot="button">
            {detail instanceof TeacherDetail ? detail.lastName : detail.name}
        </svelte:fragment>
    </Dropdown>

    <Segmented selection={week} id="weekButtons" readonly>
        <ControlLink href="/{Week.Permanent}/{detail.name}" value={Week.Permanent} />
        <ControlLink href="/{detail.name}" value={Week.Current}>Current</ControlLink>
        <ControlLink href="/{Week.Next}/{detail.name}" value={Week.Next} />

        <Button on:click={() => (advancedSettingsModal = true)}>
            <MoreHoriz />
        </Button>
    </Segmented>

    <Button on:click={invalidateAll}>
        <Refresh />

        Refresh
    </Button>
</nav>

{#if advancedSettingsModal}
    <AdvancedSettingsModal on:close={() => (advancedSettingsModal = false)} />
{/if}
