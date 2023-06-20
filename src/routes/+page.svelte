<script>
    import { onDestroy, onMount } from "svelte";
    import AdvancedSettingsModal from "../components/AdvancedSettingsModal.svelte";
    import LoadScreen from "../components/LoadScreen.svelte";
    import Options from "../components/Options.svelte";
    import ScheduleView from "../components/ScheduleView.svelte";
    import SubjectInfoModal from "../components/SubjectInfoModal.svelte";
    import { config, scheduleParams } from "../configStore";
    import { isSubjectInfoVisible, modal } from "../mainStore";
    import { scheduleMetadata } from "../staticStore";
    import { getWebScheduleMetadata, setURL } from "../utilities";

    let isLoadScreenVisible = $config.loadscreen;

    let scheduleParamsSubscriber;
    let isSubjectInfoVisibleSubscriber;
    let modalSubscriber;

    // Subscribe to stores on mount
    onMount(() => {
        scheduleParamsSubscriber = scheduleParams.subscribe((v) => {
            updateURL(v); // Note: I merged your 2 subscribers here..
            hideScreenOverlay();
        });
        isSubjectInfoVisibleSubscriber = isSubjectInfoVisible.subscribe((value) => screenOverlayEventHandler(value));
        modalSubscriber = modal.subscribe((value) => screenOverlayEventHandler(value.visible));

        // Fetch schedule metadata
        getWebScheduleMetadata().then((metadata) => {
            scheduleMetadata.rooms = metadata.rooms;
            scheduleMetadata.teachers = metadata.teachers;
        });
    });

    // anndd unsubscribe on unmount
    onDestroy(() => {
        scheduleParamsSubscriber?.();
        isSubjectInfoVisibleSubscriber?.();
        modalSubscriber?.();
    });

    function updateURL(v) {
        if (v.mode.id === "Other") {
            setURL("/", { [v.mode.name]: "", type: v.type, value: v.value });
        } else {
            setURL("/", { [v.mode.name]: "", cls: v.class.name });
        }
    }

    let isBackgroundDimmed = false;

    function screenOverlayEventHandler(value) {
        isBackgroundDimmed = value;
        if (value) document.addEventListener("keydown", esc);
    }

    function esc(e) {
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

    function openModal(e) {
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
{#if $modal.visible}
    {#if $modal.type === "AdvancedSettingsModal"}
        <AdvancedSettingsModal on:hideScreenOverlay={hideScreenOverlay} on:updateURL={() => updateURL($scheduleParams)} />
    {:else if $modal.type === "SubjectInfoModal"}
        <SubjectInfoModal on:hideScreenOverlay={hideScreenOverlay} context={$modal.context} />
    {/if}
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="dim-overlay" class:dimmed={isBackgroundDimmed} on:click={hideScreenOverlay} />
<Options on:modalOpen={openModal} />
<ScheduleView
    on:loadingFinished={() => {
        isLoadScreenVisible = false;
    }}
    on:modalOpen={openModal}
/>
