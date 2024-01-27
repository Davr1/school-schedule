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
    const weekdays = Array.from({ length: 6 }, (_, i) => permanent.format(new Date(0, 0, i + 1)));
</script>

<script lang="ts">
    import type { Schedule } from "@school-schedule/api/classes";

    import { browser } from "$app/environment";
    import { Cell } from "$lib/schedule";

    import Lesson from "$components/Schedule/Cell/Cell.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    export let day: Schedule;

    // The day index starts with Sunday (0), but we want to start with Monday (1) so we need to subtract 1
    // There's also 2 rows per day, so we need to multiply the day index by 2
    $: row = (day.day - 1) * 2;

    // Format the date if it's a Date object, otherwise use the weekday
    $: date = day.date instanceof Date ? normal.format(day.date) : weekdays[day.day];

    // Get the cell array from the periods array
    $: cells = Cell.fromSchedule(day);

    // Log this for debugging purposes (but only in the browser, on the server it just clutters the console)
    if (browser) console.log(day);
</script>

<span class={styles.date} style:grid-row={`${2 + row} / span 2`}>
    {date}
</span>

<div class={styles.day}>
    {#each cells as cell}
        <Lesson {cell} {row} />
    {/each}
</div>
