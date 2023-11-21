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
    export let size: string | number = "100%";

    /** The padding around the icon */
    export let padding: number = 1;

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

    // Viewbox
    $: vb = 14 + 2 * padding;

    // Square generation
    $: square = (x: number, y: number, color: keyof Colors) => ({ x: x + padding, y: y + padding, color });
    $: squares = [
        square(0, 0, "Accent"),
        square(5, 0, "FG"),
        square(10, 5, "FG"),
        square(5, 10, "Accent"),
        square(0, 10, "FG"),
        square(0, 5, "FG")
    ];
</script>

<svg bind:this={SVG} width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} xmlns="http://www.w3.org/2000/svg">
    <rect width={vb} height={vb} rx={rounding} fill={colors.BG} />
    {#if frame !== undefined && frame !== null}
        {@const [s1, s2, s3] = [squares[frame % 6], squares[(frame + 1) % 6], squares[(frame + 2) % 6]]}
        <rect x={s1.x} y={s1.y} width="4" height="4" rx="0.7" fill={colors.FG} />
        <rect x={s2.x} y={s2.y} width="4" height="4" rx="0.7" fill={colors.FG} />
        <rect x={s3.x} y={s3.y} width="4" height="4" rx="0.7" fill={colors.Accent} />
    {:else}
        {#each squares as { x, y, color }}
            <rect {x} {y} width="4" height="4" rx="0.7" fill={colors[color]} />
        {/each}
        <rect x={5 + padding} y={5 + padding} width="4" height="1.7" rx="0.6" fill={colors.Accent} />
        <rect x={5 + padding} y={7.3 + padding} width="4" height="1.7" rx="0.6" fill={colors.FG} />
    {/if}
</svg>
