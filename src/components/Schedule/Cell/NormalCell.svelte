<script lang="ts">
    import { Group } from "@school-schedule/api/classes";

    import { addRipple } from "$lib/ripple";
    import type { NormalCell } from "$lib/schedule";

    import { scheduleParams } from "$stores/config";

    import styles from "$styles/modules/Schedule.module.scss";

    export let cell: NormalCell;

    let node: HTMLDivElement;
    let visible = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.subject} active`}
    class:changed={cell.change}
    class:floating={visible}
    style={cell.style}
    title={cell.title}
    on:click={() => (visible = !visible)}
    use:addRipple
    bind:this={node}
>
    <div class={styles.content}>
        <div class="top">
            <div class="left">
                {Group.name(cell.groups)}
            </div>

            {#if $scheduleParams.scheduleMode !== "Room"}
                <div class="right">{cell.room?.name ?? "mim"}</div>
            {/if}
        </div>

        <div class="middle">{cell.subject?.id ?? "???"}</div>

        {#if cell.teacher}
            <div class="bottom">{cell.teacher.abbreviation}</div>
        {/if}
    </div>
</div>
