<script lang="ts" context="module">
    /** The colors to use for the icon */
    export interface Colors {
        /** The background color */
        BG: string;
        /** The foreground color */
        FG: string;
        /** The accent color */
        Accent: string;
    }
</script>

<script lang="ts">
    /** Size of the icon */
    export let size: string | number;

    /** The frame to render, leave empty to render the full icon */
    export let frame: number | undefined | null = undefined;

    /** The radius of the rounded corner */
    export let rounding: number = 1.5;

    /** The colors to use for the icon */
    export let colors: Colors = {
        BG: "var(--icon-bg)",
        FG: "var(--icon-fg)",
        Accent: "var(--accent-primary)"
    };

    /** SVG element */
    export let SVG: SVGSVGElement | undefined = undefined;

    const squares: [x: number, y: number, fill: keyof Colors][] = [
        [1, 1, "Accent"],
        [6, 1, "FG"],
        [11, 6, "FG"],
        [6, 11, "Accent"],
        [1, 11, "FG"],
        [1, 6, "FG"]
    ];
</script>

<svg bind:this={SVG} width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx={rounding} fill={colors.BG} />
    {#if frame !== undefined && frame !== null}
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
