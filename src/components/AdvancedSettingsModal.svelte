<script lang="ts">
    import { config } from "$stores/config";

    import UwU from "$assets/uwu.svg?component";

    import Modal from "$components/Modal.svelte";
    import Switch from "$components/Switch.svelte";

    /** Whether the AdvancedSettingsModal is visible */
    export let visible: boolean;
</script>

<Modal bind:visible scrollable>
    <h1>Advanced settings</h1>
    <div class="option-row">Use the school's website for substitutions <Switch bind:value={$config.useWeb} /></div>
    <p>
        <span>Substituted classes taken from the school's website will be merged with the full schedule.</span>
    </p>
    <div class="option-row">Cache server responses <Switch bind:value={$config.cache} /></div>
    <p>
        <span>Improves loading speeds, but it could lead to inaccuracies.</span>
    </p>
    <div class="option-row">Show next week on Sunday <Switch bind:value={$config.sundayOverride} /></div>
    <p>
        <span>The current schedule will show the next week's schedule on Sundays.</span>
    </p>
    <div class="option-row">
        <span><UwU height="1em" style="vertical-align: sub;" /> loading screen</span>
        <Switch bind:value={$config.loadscreen} />
    </div>
    <p><span>What's this?</span></p>
</Modal>
