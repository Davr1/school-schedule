<script>
    import { isSubjectInfoVisible, isModalVisible } from "./mainStore";
    import { scheduleMetadata } from "./staticStore";
    import { config, scheduleParams } from "./configStore";
    import { setURL, fetchWebScheduleMetadata, parseWebScheduleMetadata } from "./utilities";
    import Options from "./components/Options.svelte";
    import ScheduleView from "./components/ScheduleView.svelte";
    import LoadScreen from "./components/LoadScreen.svelte";
    import AdvancedSettingsModal from "./components/AdvancedSettingsModal.svelte";

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
    isModalVisible.subscribe((value) => screenOverlayEventHandler(value));
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
            isModalVisible.set(false);
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
{#if $isModalVisible}
    <AdvancedSettingsModal />
{/if}
<div id="dim-overlay" class:dimmed={isBackgroundDimmed} on:click={hideScreenOverlay} />
<Options on:modalOpen={() => isModalVisible.set(true)} />
<ScheduleView on:loadingFinished={loadingFinished} />
