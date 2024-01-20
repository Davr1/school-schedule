<script lang="ts">
    import type { RemovedLesson } from "@school-schedule/api/classes";

    import styles from "$styles/modules/Schedule.module.scss";

    export let bakalari: RemovedLesson;

    export let row: number;
    export let column: number;
</script>

<div
    class={`${styles.subject} ${styles.cell} special`}
    style={`--row: ${row}; --column: ${column}; --width: 1; --height: 2`}
    title={bakalari.title}
/>
