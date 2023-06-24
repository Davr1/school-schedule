<script>
    import { config } from "$stores/config";

    import Uwu from "$assets/uwu.svg";

    import Modal from "$components/Modal.svelte";
    import Switch from "$components/Switch.svelte";

    let { useWeb, cache, sundayOverride, loadscreen } = $config;

    // use school website
    $: $config.useWeb = useWeb;

    // http cache
    $: $config.cache = cache;

    // Sunday override
    $: $config.sundayOverride = sundayOverride;

    // load screen
    $: $config.loadscreen = loadscreen;
</script>

<Modal on:hideScreenOverlay scrollable={true}>
    <h1>Advanced settings</h1>
    <div class="option-row">Use the school's website for substitutions <Switch bind:value={useWeb} /></div>
    <p>
        <span>Substituted classes taken from the school's website will be merged with the full schedule.</span>
    </p>
    <div class="option-row">Cache server responses <Switch bind:value={cache} /></div>
    <p>
        <span>Improves loading speeds, but it could lead to inaccuracies.</span>
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
