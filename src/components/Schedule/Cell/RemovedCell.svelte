<script lang="ts">
    import { addRipple } from "$lib/ripple";
    import type { RemovedCell } from "$lib/schedule";

    import RemovedInfo from "$components/Schedule/Cell/Info/RemovedInfo.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    export let cell: RemovedCell;

    /** Whether the subject info modal / popover is visible */
    let visible = false;
    let node: HTMLDivElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.lesson} secondary`}
    class:floating={visible}
    class:active={cell.active}
    style={cell.style}
    title={cell.title}
    on:click={() => cell.active && (visible = !visible)}
    use:addRipple={cell.active}
    bind:this={node}
>
    {#if cell.info}
        <span class={styles.middle}>{cell.info}</span>
    {/if}
</div>

{#if visible}
    <RemovedInfo {cell} {node} on:close={() => (visible = false)} />
{/if}
