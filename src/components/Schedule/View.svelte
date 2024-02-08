<script lang="ts" context="module">
    // Generate the hours labels
    const intl = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false
    });

    const hours = Array.from({ length: 12 }, (_, i) => {
        const breakTime = i < 2 ? 0 : 10; // Whether the 10min extra break should be added
        const start = new Date(0, 0, 0, 8, i * 55 + breakTime);
        const end = new Date(0, 0, 0, 8, i * 55 + 45 + breakTime);

        return intl.formatRange(start, end);
    });
</script>

<script lang="ts">
    import type { Schedule } from "@school-schedule/api/classes";

    import Day from "$components/Schedule/Day.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    export let schedule: Schedule[];
</script>

<div class={styles.grid}>
    <!-- The top left corner should be empty -->
    <span />

    <!-- Hour labels -->
    <div class={styles.day}>
        {#each hours as hour, index}
            <div class={styles.hour}>
                <div class={styles.num}>{index + 1}</div>

                <span>{hour}</span>
            </div>
        {/each}
    </div>

    <!-- Days -->
    {#each schedule as day}
        <Day {day} />
    {/each}
</div>
