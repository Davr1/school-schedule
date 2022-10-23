<script>
    import { isSubjectInfoVisible } from "../mainStore";
    import { scheduleParams } from "../configStore";
    import SubjectInfo from "./SubjectInfo.svelte";
    import { getPosition } from "../utilities";

    export let subject = {};
    let cell;

    let cls = subject.cls ?? "";
    let room = subject.room ?? "";
    let teacher = subject.teacher ?? "";
    let theme = subject.theme ?? "";
    let subjectAbbr = subject.subjectAbbr ?? "";
    let subjectText = subject.subjecttext ?? subjectAbbr ?? "";
    let teacherAbbr = subject.teacherAbbr ?? "";
    let group = ($scheduleParams.mode === "Other" ? cls + " " : "") + (subject.group ?? "");
    let changed = subject.changed;
    let changeInfo = subject.changeInfo;
    let specialChange = subject.special;

    let title =
        specialChange ??
        [
            `${theme ? theme + "\n\n" : ""}${subjectText}`,
            `${teacher}`,
            `${changed && changeInfo ? changeInfo : room}${group ? " - " + group : ""}`
        ]
            .filter((e) => e)
            .join("\n");

    let _subjectInfoVisible;

    isSubjectInfoVisible.subscribe((value) => {
        if (value === false) {
            _subjectInfoVisible = false;
        }
    });

    scheduleParams.subscribe(() => {
        _subjectInfoVisible = false;
    });

    let position;

    function showSubjectInfoScreen() {
        position = getPosition(cell);
        isSubjectInfoVisible.set(true);
        // the actual value is stored separately so updating it won't show all the cells at once
        _subjectInfoVisible = true;
    }
</script>

<div
    class="subject"
    class:changed
    class:changed2={subject.special}
    class:floating={_subjectInfoVisible}
    on:click={showSubjectInfoScreen}
    bind:this={cell}
>
    {#if _subjectInfoVisible}
        <SubjectInfo
            data={{
                position,
                subject: {
                    room,
                    teacher,
                    theme,
                    subjectText,
                    teacherAbbr,
                    group,
                    specialChange
                }
            }}
        />
    {/if}
    <div class="subject-content" {title}>
        <div class="top">
            <div class="left">{group}</div>
            <div class="right">{room}</div>
        </div>
        <div class="middle">{specialChange ?? subjectAbbr}</div>
        <div class="bottom">{teacherAbbr}</div>
    </div>
</div>
