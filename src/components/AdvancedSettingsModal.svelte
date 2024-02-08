<script lang="ts">
    import { config } from "$stores/config";

    import Modal from "$components/Modal.svelte";
    import CacheButton from "$components/CacheButton.svelte";
    import Switch from "$components/Controls/Switch.svelte";
    import ThemeEditor from "$components/ThemeEditor.svelte";

    import modalStyles from "$styles/modules/Modal.module.scss";
    import styles from "$styles/modules/Settings.module.scss";
</script>

<Modal scrollable on:close>
    <h1>Advanced settings</h1>

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
        <span>Loading screen</span>
        <Switch bind:value={$config.loadscreen} />
    </div>

    <CacheButton class={modalStyles.button} />

    <ThemeEditor />

    <div class={styles.optionRow}>
        <span>Debug mode 👀</span>
        <Switch bind:value={$config.debug} />
    </div>
    <p>
        <span>Shows JSON in lesson info...</span>
    </p>
</Modal>
