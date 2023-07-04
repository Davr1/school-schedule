<script lang="ts">
    import type { Subject } from "$lib/subject";

    import { scheduleParams } from "$stores/config";

    import SubjectInfo from "$components/SubjectInfo/Universal.svelte";

    let cell: HTMLDivElement, title: string;

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

    /** Whether the subject info modal / popover is visible */
    let visible = false;

    // Hide the modal / popover when the schedule changes (when tf does this happen?)
    scheduleParams.subscribe(() => (visible = false));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if subject.isStandard()}
    <div
        class="subject"
        class:changed={subject.change !== null}
        class:floating={visible}
        on:click={() => (visible = true)}
        bind:this={cell}
    >
        <SubjectInfo {cell} {subject} bind:visible />

        <div class="subject-content" {title}>
            <div class="top">
                <div class="left">{subject.group}</div>
                {#if $scheduleParams.scheduleMode !== "Room"}<div class="right">{subject.room}</div>{/if}
            </div>
            <div class="middle">{subject.abbreviation}</div>
            {#if $scheduleParams.scheduleMode !== "Teacher"}<div class="bottom">{subject.teacher.abbreviation.split(",")[0]}</div>{/if}
        </div>
    </div>
{:else if subject.isSpecial()}
    <div
        class="subject changed2"
        class:floating={visible}
        on:click={() => subject.isSpecial() && subject.abbreviation && subject.name && (visible = true)}
        bind:this={cell}
    >
        <SubjectInfo {cell} {subject} bind:visible />

        <div class="subject-content" {title}>
            <div class="middle">{subject.abbreviation || subject.name}</div>
        </div>
    </div>
{:else if subject.isEmpty() && subject.change}
    <div class="subject changed2" bind:this={cell}>
        <div class="subject-content" />
    </div>
{/if}
