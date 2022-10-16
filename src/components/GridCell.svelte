<script>
    import { isSubjectInfoVisible, scheduleParams } from "../mainStore";
    import SubjectInfo from "./SubjectInfo.svelte";

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

    let position;

    function showSubjectInfoScreen() {
        position = {
            size: cell.getBoundingClientRect(),
            get x() {
                return this.size.left + this.size.width / 2;
            },
            get y() {
                return this.size.top + this.size.height / 2;
            },
            get windowX() {
                return document.body.clientWidth / 2;
            },
            get windowY() {
                return document.body.clientHeight / 2;
            }
        };
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
                    cls,
                    room,
                    teacher,
                    theme,
                    subjectAbbr,
                    subjectText,
                    teacherAbbr,
                    group,
                    changed,
                    changeInfo,
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
