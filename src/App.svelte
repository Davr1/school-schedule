<script>
    import { isSubjectInfoVisible, modal } from "./mainStore";
    import { scheduleMetadata } from "./staticStore";
    import { config, scheduleParams } from "./configStore";
    import { setURL, fetchWebScheduleMetadata, parseWebScheduleMetadata } from "./utilities";
    import Options from "./components/Options.svelte";
    import ScheduleView from "./components/ScheduleView.svelte";
    import LoadScreen from "./components/LoadScreen.svelte";
    import AdvancedSettingsModal from "./components/AdvancedSettingsModal.svelte";
    import SubjectInfoModal from "./components/SubjectInfoModal.svelte";

    let isLoadScreenVisible = $config.loadscreen;

    scheduleParams.subscribe((v) => {
        setURL(
            "/",
            v.mode.id !== "Other"
                ? {
                      [v.mode.name]: "",
                      cls: v.class.name
                  }
                : {
                      Other: "",
                      type: v.type,
                      value: v.value
                  }
        );
    });

    function loadingFinished() {
        isLoadScreenVisible = false;
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

    async function getScheduleMetadata() {
        let additionalScheduleMetadata = await parseWebScheduleMetadata(fetchWebScheduleMetadata());
        scheduleMetadata.rooms = additionalScheduleMetadata.rooms;
        scheduleMetadata.teachers = additionalScheduleMetadata.teachers;
    }

    getScheduleMetadata();
</script>

{#if isLoadScreenVisible}
    <LoadScreen />
{/if}
{#if $modal.visible}
    {#if $modal.type === "AdvancedSettingsModal"}
        <AdvancedSettingsModal on:hideScreenOverlay={hideScreenOverlay} />
    {:else if $modal.type === "SubjectInfoModal"}
        <SubjectInfoModal on:hideScreenOverlay={hideScreenOverlay} context={$modal.context} />
    {/if}
{/if}
<div id="dim-overlay" class:dimmed={isBackgroundDimmed} on:click={hideScreenOverlay} />
<Options on:modalOpen={openModal} />
<ScheduleView on:loadingFinished={loadingFinished} on:modalOpen={openModal} />
