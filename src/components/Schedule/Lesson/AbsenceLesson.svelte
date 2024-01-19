<script lang="ts">
    import { addRipple } from "$lib/ripple";

    import styles from "$styles/modules/Schedule.module.scss";

    import type { AbsenceLesson } from "@/classes";

    let cell: HTMLDivElement;

    export let bakalari: AbsenceLesson;

    export let row: number;
    export let column: number;

    /** Whether the subject info modal / popover is visible */
    let visible = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.subject} ${styles.cell} special`}
    class:floating={visible}
    class:active={bakalari.name}
    style={`--row: ${row}; --column: ${column}; --width: 1; --height: 2`}
    on:click={() => bakalari.name && (visible = !visible)}
    bind:this={cell}
    use:addRipple
>
    <!-- <SubjectInfo {cell} subject={lesson} bind:visible /> -->

    <div class={styles.content} title={bakalari.title}>
        <div class="middle">{bakalari.info}</div>
    </div>
</div>
