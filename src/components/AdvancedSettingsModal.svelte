<script lang="ts">
    import { config } from "$stores/config";

    import UwU from "$assets/uwu.svg?component";
    import Close from "@material-design-icons/svg/filled/close.svg?component";

    import CacheButton from "$components/CacheButton.svelte";
    import Button from "$components/Controls/Button.svelte";
    import Modal from "$components/Modal.svelte";
    import Switch from "$components/Switch.svelte";
    import ThemeEditor from "$components/ThemeEditor.svelte";

    import modalStyles from "$styles/modules/Modal.module.scss";
    import styles from "$styles/modules/Settings.module.scss";

    /** Whether the AdvancedSettingsModal is visible */
    export let visible: boolean;
</script>

<Modal bind:visible scrollable>
    <div class={modalStyles.title}>
        <h1>Advanced settings</h1>

        <Button class="big" on:click={() => (visible = false)}>
            <Close />
        </Button>
    </div>

    <div class={styles.optionRow}>Use the school's website for substitutions <Switch bind:value={$config.useWeb} /></div>
    <p>
        <span>Substituted classes taken from the school's website will be merged with the full schedule.</span>
    </p>
    <div class={styles.optionRow}>Show next week on Saturday <Switch bind:value={$config.saturdayOverride} /></div>
    <p>
        <span>The current schedule will show the next week's schedule on Saturday.</span>
    </p>
    <div class={styles.optionRow}>Merge subjects <Switch bind:value={$config.mergeSubjects} /></div>
    <p>
        <span>Merges adjacent groups and subjects to reduce screen clutter.</span>
    </p>
    <div class={styles.optionRow}>
        <span><UwU height="1em" style="vertical-align: sub;" /> loading screen</span>
        <Switch bind:value={$config.loadscreen} />
    </div>
    <p><span>What's this?</span></p>

    <CacheButton class={modalStyles.button} />

    <ThemeEditor {visible} />
</Modal>
