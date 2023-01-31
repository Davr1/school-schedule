<script>
    import { isSubjectInfoVisible } from "../mainStore";
    import { scheduleParams } from "../configStore";
    import { getPosition } from "../utilities";
    import { createEventDispatcher } from "svelte";
    import SubjectInfo from "./SubjectInfo.svelte";

    const dispatch = createEventDispatcher();

    let cell, position, title;

    export let subject = {};
    subject.subject = subject.subject ?? subject.subjectAbbr ?? "";
    subject.group = ($scheduleParams.mode.id === "Other" ? subject.cls + " " : "") + (subject.group ?? "");

    title =
        subject.special ??
        [
            `${subject.theme ? subject.theme + "\n\n" : ""}${subject.subject}`,
            `${subject.teacher}`,
            `${subject.changed && subject.changeInfo ? subject.changeInfo : subject.room}${subject.group ? " - " + subject.group : ""}`
        ]
            .filter((e) => e)
            .join("\n");

    let subjectInfoVisible;

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
<div
    class="subject"
    class:changed={subject.changed}
    class:changed2={subject.special}
    class:floating={subjectInfoVisible}
    on:click={showSubjectInfoScreen}
    bind:this={cell}
>
    {#if subjectInfoVisible}
        <SubjectInfo data={{ position, ...{ subject: subject } }} on:modalOpen />
    {/if}
    <div class="subject-content" {title}>
        <div class="top">
            <div class="left">{subject.group}</div>
            <div class="right">{subject.room}</div>
        </div>
        <div class="middle">{subject.specialAbbr ?? subject.special ?? subject.subjectAbbr}</div>
        <div class="bottom">{subject.teacherAbbr ?? ""}</div>
    </div>
</div>
