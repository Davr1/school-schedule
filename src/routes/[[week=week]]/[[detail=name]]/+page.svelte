<script lang="ts">
    import { Week } from "@/loader/bakalari";
    import { onMount } from "svelte";

    import { replaceState } from "$app/navigation";

    import LoadScreen from "$components/LoadScreen.svelte";
    import ScheduleView from "$components/Schedule/View.svelte";

    export let data;

    onMount(() => {
        // Once the page loads, check if we're on the root page
        // If we are then do a shallow redirect to the default schedule
        if (!data.unspecified) return;

        // Note: This throws an error, but it replaces it correctly so I'm just gonna ignore it :/
        try {
            replaceState(`${data.week !== Week.Current ? `/${data.week.toLowerCase()}` : ""}/${data.detail.name}`, {});
        } catch (e) {}
    });
</script>

{#await data.schedule}
    <LoadScreen />
{:then schedule}
    <ScheduleView {schedule} />
{/await}
