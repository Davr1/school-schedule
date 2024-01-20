<script lang="ts">
    import type { Schedule } from "@school-schedule/api/classes";

    import { hours } from "$stores/static";

    import Day from "$components/Schedule/Day.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    export let schedule: Schedule[];
</script>

<main class={styles.view}>
    <div class={styles.hours}>
        {#each hours.formattedTime as [from, until], index}
            <div class={styles.hour}>
                <div class={styles.num}>{index + 1}</div>

                <span>{from} - {until}</span>
            </div>
        {/each}
    </div>

    <div class={styles.grid}>
        {#each schedule as day}
            <Day {day} />
        {/each}
    </div>
</main>
