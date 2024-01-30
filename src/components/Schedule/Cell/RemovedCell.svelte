<script lang="ts">
    import { addRipple } from "$lib/ripple";
    import type { RemovedCell } from "$lib/schedule";

    import styles from "$styles/modules/Schedule.module.scss";

    export let cell: RemovedCell;

    /** Whether the subject info modal / popover is visible */
    let visible = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.subject} special`}
    class:floating={visible}
    class:active={cell.active}
    style={cell.style}
    title={cell.title}
    on:click={() => cell.active && (visible = !visible)}
    use:addRipple
>
    {#if cell.info}
        <div class={styles.content}>
            <div class="middle">{cell.info}</div>
        </div>
    {/if}
</div>
