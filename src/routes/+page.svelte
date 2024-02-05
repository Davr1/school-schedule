<script lang="ts">
    import Options from "$components/Options.svelte";
    import ScheduleView from "$components/Schedule/View.svelte";

    export let data;
</script>

<Options />
<ScheduleView schedule={data.schedule} />
