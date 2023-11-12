<script lang="ts">
    import { browser } from "$app/environment";
    import theme from "$stores/theme";
    import { tick } from "svelte";
    import colors from "tailwindcss/colors.js";

    export let darkMode: boolean = true;

    export let loading: boolean;
    let frame: number;

    // reset to the first frame when the loading state changes
    // the animation actually starts playing at the fourth frame
    $: loading, (frame = 0);

    // the minimum delay that chromium allows is ~250ms, while firefox allows about 125ms
    setInterval(() => {
        if (loading) frame++;
    }, 250);

    interface Colors {
        BG: string;
        FG: string;
        Accent: string;
    }

    const squares: [x: number, y: number, fill: keyof Colors][] = [
        [1, 1, "Accent"],
        [6, 1, "FG"],
        [11, 6, "FG"],
        [6, 11, "Accent"],
        [1, 11, "FG"],
        [1, 6, "FG"]
    ];

    let SVG: SVGSVGElement, SVGColors: Colors;

    async function update() {
        SVGColors = darkMode
            ? {
                  BG: colors[$theme.background][900],
                  FG: colors[$theme.background][700],
                  Accent: colors[$theme.primary][500]
              }
            : {
                  BG: "#eee",
                  FG: colors[$theme.background][400],
                  Accent: colors[$theme.primary][500]
              };

        // wait for the SVG to fully render
        await tick();

        if (!browser) return;

        let favicon = document.getElementById("favicon") as HTMLLinkElement;
        favicon.href = "data:image/svg+xml," + encodeURIComponent(SVG.outerHTML);
    }

    $: $theme, frame, loading, update();
</script>

<svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" bind:this={SVG} class:loading>
    <rect width="16" height="16" rx="1.5" fill={SVGColors.BG} />
    {#if loading && frame > 3}
        {@const [s1, s2, s3] = [squares[frame % 6], squares[(frame + 1) % 6], squares[(frame + 2) % 6]]}
        <rect x={s1[0]} y={s1[1]} width="4" height="4" rx="0.7" fill={SVGColors.FG} />
        <rect x={s2[0]} y={s2[1]} width="4" height="4" rx="0.7" fill={SVGColors.FG} />
        <rect x={s3[0]} y={s3[1]} width="4" height="4" rx="0.7" fill={SVGColors.Accent} />
    {:else}
        {#each squares as [x, y, color]}
            <rect {x} {y} width="4" height="4" rx="0.7" fill={SVGColors[color]} />
        {/each}
        <rect x="6" y="6" width="4" height="1.7" rx="0.6" fill={SVGColors.Accent} />
        <rect x="6" y="8.3" width="4" height="1.7" rx="0.6" fill={SVGColors.FG} />
    {/if}
</svg>
