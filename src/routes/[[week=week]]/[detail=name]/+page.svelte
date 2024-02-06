<script lang="ts">
    import ScheduleView from "$components/Schedule/View.svelte";

    export let data;
</script>

<ScheduleView schedule={data.schedule} />
