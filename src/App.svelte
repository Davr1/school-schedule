<script>
    import Options from "./components/Options.svelte";
    import ScheduleView from "./components/ScheduleView.svelte";
    import { scheduleParams } from "./mainStore";
    import { setURL } from "./utilities";

    scheduleParams.subscribe((v) => setURL("/", { [v.mode]: "", cls: v.class?.name }));
</script>

<Options />
<ScheduleView />
