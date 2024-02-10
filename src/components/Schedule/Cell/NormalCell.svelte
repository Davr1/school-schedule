<script lang="ts">
    import { DetailType, Group } from "@school-schedule/api/classes";

    import { page } from "$app/stores";
    import { addRipple } from "$lib/ripple";
    import type { NormalCell } from "$lib/schedule";

    import NormalInfo from "$components/Schedule/Cell/Info/NormalInfo.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    export let cell: NormalCell;

    let node: HTMLDivElement;
    let visible = false;

    // Kind of a hack to get the type of the selected detail
    $: type = $page.data.detail.type as DetailType;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.lesson} active`}
    class:primary={cell.change}
    class:floating={visible}
    style={cell.style}
    title={cell.title}
    on:click={() => (visible = true)}
    use:addRipple
    bind:this={node}
>
    <div class={styles.top}>
        <span>{Group.name(cell.groups)}</span>

        {#if type !== DetailType.Room}
            <span>{cell.room?.name ?? "mim"}</span>
        {/if}
    </div>

    <span class={styles.middle}>{cell.subject?.id ?? "???"}</span>

    {#if cell.teacher}
        <span class={styles.bottom}>{cell.teacher.abbreviation}</span>
    {/if}
</div>

{#if visible}
    <NormalInfo {cell} {node} on:close={() => (visible = false)} />
{/if}
