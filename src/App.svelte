<script>
    import { isSubjectInfoVisible, modal } from "./mainStore";
    import { scheduleMetadata } from "./staticStore";
    import { config, scheduleParams } from "./configStore";
    import { setURL, getWebScheduleMetadata } from "./utilities";
    import Options from "./components/Options.svelte";
    import ScheduleView from "./components/ScheduleView.svelte";
    import LoadScreen from "./components/LoadScreen.svelte";
    import AdvancedSettingsModal from "./components/AdvancedSettingsModal.svelte";
    import SubjectInfoModal from "./components/SubjectInfoModal.svelte";

    let isLoadScreenVisible = $config.loadscreen;

    scheduleParams.subscribe((v) => updateURL(v));

    function updateURL(v) {
        if (v.mode.id === "Other") {
            setURL("/", { [v.mode.name]: "", type: v.type, value: v.value });
        } else {
            setURL("/", { [v.mode.name]: "", cls: v.class.name });
        }
    }

    let isBackgroundDimmed = false;

    isSubjectInfoVisible.subscribe((value) => screenOverlayEventHandler(value));
    modal.subscribe((value) => screenOverlayEventHandler(value.visible));
    scheduleParams.subscribe(() => hideScreenOverlay());

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

    (async () => {
        let additionalScheduleMetadata = await getWebScheduleMetadata();
        scheduleMetadata.rooms = additionalScheduleMetadata.rooms;
        scheduleMetadata.teachers = additionalScheduleMetadata.teachers;
    })();
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
