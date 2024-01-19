<script lang="ts" context="module">
    const normal = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        day: "numeric",
        month: "numeric",
        timeZone: "UTC"
    });

    const permanent = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        timeZone: "UTC"
    });

    // Monday - Friday localized to the current locale
    const weekdays = Array.from({ length: 5 }, (_, i) => permanent.format(new Date(0, 0, i + 1)));
</script>

<script lang="ts">
    import Lesson from "$components/Schedule/Lesson/Lesson.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    import type { Schedule } from "@/classes";

    export let day: Schedule;

    // The day index starts with Sunday (0), but we want to start with Monday (1) so we need to subtract 1
    // There's also 2 rows per day, so we need to multiply the day index by 2
    $: row = (day.day - 1) * 2;

    console.log(day);

    // Format the date if it's a Date object, otherwise use the weekday
    $: date = day.date instanceof Date ? normal.format(day.date) : weekdays[day.day - 1];
</script>

<span class={styles.day} style:grid-row={`${1 + row} / span 2`}>
    {date}
</span>

{#each day.periods as cell, i}
    {#each cell as lesson}
        <Lesson {lesson} on:modalOpen {row} column={i} />
    {/each}
{/each}
