<script lang="ts">
    import Options from "$components/Options.svelte";
    import ScheduleView from "$components/Schedule/View.svelte";

    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<Options />
<ScheduleView schedule={data.schedule} />
