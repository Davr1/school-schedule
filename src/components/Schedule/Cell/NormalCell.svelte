<script lang="ts">
    import { Group, type NormalLesson } from "@school-schedule/api/classes";

    import { addRipple } from "$lib/ripple";
    import type { Cell } from "$lib/schedule";

    import { scheduleParams } from "$stores/config";

    import styles from "$styles/modules/Schedule.module.scss";

    // let cell: HTMLDivElement;

    export let cell: Cell<NormalLesson>;
    export let y: number;

    $: lesson = cell.lessons[0];
    $: groups = cell.lessons.flatMap((l) => l.groups);
    $: changed = cell.lessons.some((l) => l.change);

    let visible = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.subject} active`}
    class:changed
    class:floating={visible}
    style={`--row: ${y}; --column: ${cell.x}; --width: ${cell.width}; --height: ${cell.height}`}
    on:click={() => (visible = !visible)}
    use:addRipple
>
    <!-- <SubjectInfo {cell} subject={lesson} bind:visible /> -->

    <div class={styles.content}>
        <div class="top">
            <div class="left">
                {Group.name(groups)}
            </div>

            {#if $scheduleParams.scheduleMode !== "Room"}
                <div class="right">{lesson.room?.name ?? "mim"}</div>
            {/if}
        </div>

        <div class="middle">{lesson.subject?.id ?? "???"}</div>

        {#if lesson.teacher}
            <div class="bottom">{lesson.teacher.abbreviation}</div>
        {/if}
    </div>
</div>
