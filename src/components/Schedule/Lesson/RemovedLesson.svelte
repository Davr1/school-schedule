<script lang="ts">
    import styles from "$styles/modules/Schedule.module.scss";

    import type { RemovedLesson } from "@/classes";

    export let bakalari: RemovedLesson;

    export let row: number;
    export let column: number;
</script>

<div
    class={`${styles.subject} ${styles.cell} special`}
    style={`--row: ${row}; --column: ${column}; --width: 1; --height: 2`}
    title={bakalari.title}
/>
