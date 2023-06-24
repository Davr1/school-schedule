<script>
    import { config } from "../configStore";
    import { createEventDispatcher } from "svelte";
    import Switch from "./Switch.svelte";
    import Modal from "./Modal.svelte";
    import Uwu from "../assets/uwu.svg";

    const dispatch = createEventDispatcher();

    let { updateURL, keepState, useWeb, cache, sundayOverride, loadscreen } = $config;

    // URL update
    $: {
        $config.updateURL = updateURL;
        dispatch("updateURL");
    }

    // keep state
    $: $config.keepState = keepState;

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
    <div class="option-row">Display current schedule options in the URL <Switch bind:value={updateURL} /></div>
    <p>
        <span>When enabled, schedule options will be automatically appended to the url as parameters.</span>
        <span>Allows for easier sharing and browser history traversing.</span>
    </p>
    <div class="option-row">Save last selected schedule options <Switch bind:value={keepState} /></div>
    <p>
        <span>Schedule options will be saved in the browser's local storage.</span>
        <span>They will be used as the defaults if no other overrides are present.</span>
    </p>
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
