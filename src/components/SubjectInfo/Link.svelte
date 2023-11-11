<script lang="ts">
    import styles from "$styles/modules/Schedule.module.scss";
    import { isValidMetadata } from "$lib/utilities";
    import { scheduleParams, type ScheduleParams, type UncheckedParams } from "$stores/config";
    import { cache } from "$stores/main";

    export let params: Partial<UncheckedParams>;
    export let text: string = "";

    let fullParams: UncheckedParams = { ...$scheduleParams, ...params };

    let enabled = !$cache && isValidMetadata(fullParams);

    function click() {
        if (enabled) scheduleParams.set(fullParams as ScheduleParams);
    }
</script>

<span role="link" tabindex={enabled ? 0 : -1} class={enabled ? styles.link : ""} on:click={click} on:keypress={click}>
    {text || params.value}
</span>
