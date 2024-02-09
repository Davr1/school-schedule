<script lang="ts">
    import { onMount, tick } from "svelte";

    import { browser } from "$app/environment";

    import theme from "$stores/theme";

    import Icon, { type Colors } from "$components/Icon/Icon.svelte";
    import { colors as globalColors } from "$components/Theme.svelte";

    export let loading: boolean;
    let frame: number;

    // reset to the first frame when the loading state changes
    // the animation actually starts playing at the fourth frame
    $: loading, (frame = 0);

    // Can the browser display SVG favicons? (Safari can't)
    $: enabled = browser && !(navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome"));

    let favicon: HTMLLinkElement;

    onMount(() => {
        // start a timer on mount
        // the minimum delay that chromium allows is ~250ms, while firefox allows about 125ms
        const timer = setInterval(() => {
            if (loading) frame++;
        }, 250);

        // store the original href (Theme.svelte will change it instead, if present)
        favicon = document.getElementById("favicon") as HTMLLinkElement;
        favicon.dataset.original = favicon.href;

        return () => {
            if (timer !== undefined) clearInterval(timer);

            // reset the href
            favicon.href = favicon.dataset.original!;
            favicon.removeAttribute("data-original");
        };
    });

    // On load, set the colors to the actual values of the CSS variables
    let colors: Colors;
    $: if ($globalColors) colors = { BG: $globalColors.icon.background, FG: $globalColors.icon.foreground, Accent: $globalColors.accent };

    let SVG: SVGSVGElement;

    async function update() {
        if (!enabled) return;

        // wait for the SVG to fully render
        await tick();

        // don't update if the variables haven't been loaded yet
        if (!colors) return;

        favicon.href = "data:image/svg+xml," + encodeURIComponent(SVG.outerHTML);
    }

    $: $theme, frame, loading, update();
</script>

<!-- Skip the first 4 frames (1 second wait time) -->
<Icon size="10vh" frame={frame > 3 ? frame : null} bind:SVG {colors} />
