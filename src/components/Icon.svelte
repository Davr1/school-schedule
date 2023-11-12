<script lang="ts">
    import { tick } from "svelte";

    import { browser } from "$app/environment";

    import theme from "$stores/theme";

    export let loading: boolean;
    let frame: number;

    export let size: number;

    // reset to the first frame when the loading state changes
    // the animation actually starts playing at the fourth frame
    $: loading, (frame = 0);

    // the minimum delay that chromium allows is ~250ms, while firefox allows about 125ms
    setInterval(() => {
        if (loading) frame++;
    }, 250);

    // Use the colors from the css variables
    const colors = {
        BG: "var(--icon-bg)",
        FG: "var(--icon-fg)",
        Accent: "var(--accent-primary)"
    };

    // On load, replace the variables with their values (to support the favicon)
    let loaded = false;
    $: {
        if (!browser) break $;
        loaded = true;

        // Use $theme.active, .background and .primary as dependencies for this reactive statement
        // This is to make sure that the colors are updated when the theme changes
        $theme.active, $theme.background, $theme.primary;

        // Get the actual values of the css variables
        const style = getComputedStyle(document.documentElement);

        // Replace the values in the colors object
        colors.BG = style.getPropertyValue("--icon-bg");
        colors.FG = style.getPropertyValue("--icon-fg");
        colors.Accent = style.getPropertyValue("--accent-primary");
    }

    const squares: [x: number, y: number, fill: keyof typeof colors][] = [
        [1, 1, "Accent"],
        [6, 1, "FG"],
        [11, 6, "FG"],
        [6, 11, "Accent"],
        [1, 11, "FG"],
        [1, 6, "FG"]
    ];

    let SVG: SVGSVGElement;

    async function update() {
        // wait for the SVG to fully render
        await tick();

        // don't update if the variables haven't been loaded yet
        if (!browser || !loaded) return;

        let favicon = document.getElementById("favicon") as HTMLLinkElement;
        favicon.href = "data:image/svg+xml," + encodeURIComponent(SVG.outerHTML);
    }

    $: $theme, frame, loading, update();
</script>

<svg width={`${size}vh`} height={`${size}vh`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" bind:this={SVG} class:loading>
    <rect width="16" height="16" rx="1.5" fill={colors.BG} />
    {#if loading && frame > 3}
        {@const [s1, s2, s3] = [squares[frame % 6], squares[(frame + 1) % 6], squares[(frame + 2) % 6]]}
        <rect x={s1[0]} y={s1[1]} width="4" height="4" rx="0.7" fill={colors.FG} />
        <rect x={s2[0]} y={s2[1]} width="4" height="4" rx="0.7" fill={colors.FG} />
        <rect x={s3[0]} y={s3[1]} width="4" height="4" rx="0.7" fill={colors.Accent} />
    {:else}
        {#each squares as [x, y, color]}
            <rect {x} {y} width="4" height="4" rx="0.7" fill={colors[color]} />
        {/each}
        <rect x="6" y="6" width="4" height="1.7" rx="0.6" fill={colors.Accent} />
        <rect x="6" y="8.3" width="4" height="1.7" rx="0.6" fill={colors.FG} />
    {/if}
</svg>
