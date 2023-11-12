<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";

    import { browser } from "$app/environment";

    import Icon, { type Colors } from "$components/Icon/Icon.svelte";
    import theme, { Theme } from "$stores/theme";

    export let loading: boolean;
    let frame: number;

    // reset to the first frame when the loading state changes
    // the animation actually starts playing at the fourth frame
    $: loading, (frame = 0);

    // start a timer on mount
    // the minimum delay that chromium allows is ~250ms, while firefox allows about 125ms
    let timer: NodeJS.Timeout; // the type irl is actually number, but ts types are set to Node
    onMount(() => {
        timer = setInterval(() => {
            if (loading) frame++;
        }, 250);
    });

    // clear the timer on unmount
    onDestroy(() => {
        if (timer !== undefined) clearInterval(timer);
    });

    // On load, set the colors to the actual values of the CSS variables
    let colors: Colors;
    $: {
        if (!browser) break $;

        // Use $theme.active, .background and .primary as dependencies for this reactive statement
        // This is to make sure that the colors are updated when the theme changes
        $theme.active, $theme.background, $theme.primary;

        // Get the actual values of the css variables
        const style = getComputedStyle(document.documentElement);

        // Replace the values in the colors object
        colors = {
            BG: style.getPropertyValue("--icon-bg"),
            FG: style.getPropertyValue("--icon-fg"),
            Accent: style.getPropertyValue("--accent-primary")
        };

        // Update the other icons to match
        document.querySelectorAll("link[rel$='icon']").forEach((node) => {
            if (node instanceof HTMLLinkElement)
                node.href = node.href.replace(
                    /\w+-\w+$/,
                    $theme.active === Theme.Original ? "original-original" : `${$theme.background}-${$theme.primary}`
                );
        });
    }

    let SVG: SVGSVGElement;

    async function update() {
        // wait for the SVG to fully render
        await tick();

        // don't update if the variables haven't been loaded yet
        if (!browser || !colors) return;

        let favicon = document.getElementById("favicon") as HTMLLinkElement;
        favicon.href = "data:image/svg+xml," + encodeURIComponent(SVG.outerHTML);
    }

    $: $theme, frame, loading, update();
</script>

<!-- Skip the first 4 frames (1 second wait time) -->
<Icon size="10vh" frame={frame > 3 ? frame : null} bind:SVG {colors} />
