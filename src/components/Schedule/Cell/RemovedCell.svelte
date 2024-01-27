<script lang="ts">
    import type { RemovedLesson } from "@school-schedule/api/classes";

    import { addRipple } from "$lib/ripple";
    import type { Cell } from "$lib/schedule";

    import styles from "$styles/modules/Schedule.module.scss";

    // let cell: HTMLDivElement;

    export let cell: Cell<RemovedLesson>;
    export let y: number;

    $: lesson = cell.lessons[0];
    $: active = Boolean(lesson.info && lesson.name);

    /** Whether the subject info modal / popover is visible */
    let visible = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.subject} special`}
    class:floating={visible}
    class:active
    style={`--row: ${y}; --column: ${cell.x}; --width: ${cell.width}; --height: ${cell.height}`}
    on:click={() => active && (visible = !visible)}
    use:addRipple
>
    <!-- <SubjectInfo {cell} subject={lesson} bind:visible /> -->

    {#if lesson.info}
        <div class={styles.content} title={lesson.name}>
            <div class="middle">{lesson.info}</div>
        </div>
    {/if}
</div>
