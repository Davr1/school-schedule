<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { Unsubscriber } from "svelte/store";

    import { config, scheduleParams } from "$stores/config";
    import { isSubjectInfoVisible } from "$stores/main";
    import { modal } from "$stores/modal";

    import LoadScreen from "$components/LoadScreen.svelte";
    import Options from "$components/Options.svelte";
    import ScheduleView from "$components/ScheduleView.svelte";

    let isLoadScreenVisible = $config.loadscreen;

    let scheduleParamsSubscriber: Unsubscriber;
    let isSubjectInfoVisibleSubscriber: Unsubscriber;
    let modalSubscriber: Unsubscriber;

    // Subscribe to stores on mount
    onMount(() => {
        scheduleParamsSubscriber = scheduleParams.subscribe(hideScreenOverlay);
        isSubjectInfoVisibleSubscriber = isSubjectInfoVisible.subscribe(screenOverlayEventHandler);

        modalSubscriber = modal.subscribe((value) => screenOverlayEventHandler(value.visible));
    });

    // anndd unsubscribe on unmount
    onDestroy(() => {
        scheduleParamsSubscriber?.();
        isSubjectInfoVisibleSubscriber?.();
        modalSubscriber?.();
    });

    let isBackgroundDimmed = false;

    function screenOverlayEventHandler(value: boolean) {
        isBackgroundDimmed = value;

        if (value) document.addEventListener("keydown", esc);
    }

    function esc(e: KeyboardEvent) {
        if (e.key === "Escape") hideScreenOverlay();
    }

    function hideScreenOverlay() {
        isBackgroundDimmed = false;

        document.removeEventListener("keydown", esc);

        setTimeout(() => {
            isSubjectInfoVisible.set(false);
            modal.update((v) => {
                v.visible = false;
                return v;
            });
        });
    }

    // TODO: This seriously needs to be rewritten..
    function openModal(e: any) {
        modal.update((v) => {
            v.type = e.detail?.type ?? "";
            v.context = e.detail?.context ?? {};
            v.visible = true;
            return v;
        });
    }
</script>

{#if isLoadScreenVisible}
    <LoadScreen />
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="dim-overlay" class:dimmed={isBackgroundDimmed} on:click={hideScreenOverlay} />
<Options on:modalOpen={openModal} />
<ScheduleView
    on:loadingFinished={() => {
        isLoadScreenVisible = false;
    }}
    on:modalOpen={openModal}
/>
