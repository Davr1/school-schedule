<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Subject } from "$lib/subject";
    import { getPosition } from "$lib/utilities";

    import { scheduleParams } from "$stores/config";
    import { isSubjectInfoVisible } from "$stores/main";

    import SubjectInfo from "$components/SubjectInfo.svelte";

    const dispatch = createEventDispatcher<{ modalOpen: { type: "SubjectInfoModal"; context: { subject: Subject } } }>();

    let cell: HTMLElement, position: ReturnType<typeof getPosition>, title: string;

    export let subject: Subject;

    title = subject.isSpecial()
        ? subject.name
        : subject.isStandard()
        ? [
              `${subject.theme + "\n\n"}${subject.name}`,
              `${subject.teacher.name}`,
              `${subject.change ?? subject.room}${subject.group ? " - " + subject.group : ""}`
          ]
              .filter((e) => e)
              .join("\n")
        : ""; // idk what you want for empty subjects..

    let subjectInfoVisible: boolean;

    isSubjectInfoVisible.subscribe((value) => {
        if (value === false) {
            subjectInfoVisible = false;
        }
    });

    scheduleParams.subscribe(() => {
        subjectInfoVisible = false;
    });

    function showSubjectInfoScreen() {
        position = getPosition(cell);

        if (window.innerWidth / window.innerHeight > 3 / 4) {
            isSubjectInfoVisible.set(true);
            // the actual value is stored separately so updating it won't show all the cells at once
            subjectInfoVisible = true;
        } else {
            dispatch("modalOpen", { type: "SubjectInfoModal", context: { subject: subject } });
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if subject.isStandard()}
    <div
        class="subject"
        class:changed={subject.change !== null}
        class:floating={subjectInfoVisible}
        on:click={showSubjectInfoScreen}
        bind:this={cell}
    >
        {#if subjectInfoVisible}
            <SubjectInfo {position} {subject} on:modalOpen />
        {/if}
        <div class="subject-content" {title}>
            <div class="top">
                <div class="left">{subject.group}</div>
                <div class="right">{subject.room}</div>
            </div>
            <div class="middle">{subject.abbreviation}</div>
            <div class="bottom">{subject.teacher.abbreviation.split(",")[0]}</div>
        </div>
    </div>
{:else if subject.isSpecial()}
    <div
        class="subject changed2"
        class:floating={subjectInfoVisible}
        on:click={() => {
            // Idk why the check here is required.. typescript is weird
            // It should be true at runtime anyway so it's fine
            if (subject.isSpecial() && subject.abbreviation && subject.name) showSubjectInfoScreen();
        }}
        bind:this={cell}
    >
        {#if subjectInfoVisible}
            <SubjectInfo {position} {subject} on:modalOpen />
        {/if}
        <div class="subject-content" {title}>
            <div class="middle">{subject.abbreviation || subject.name}</div>
        </div>
    </div>
{:else if subject.isEmpty() && subject.change}
    <div class="subject changed2" bind:this={cell}>
        <div class="subject-content" />
    </div>
{/if}
