<script>
    import { isSubjectInfoVisible } from "../mainStore";
    import { scheduleParams } from "../configStore";
    import { getPosition } from "../utilities";
    import { createEventDispatcher } from "svelte";
    import SubjectInfo from "./SubjectInfo.svelte";

    const dispatch = createEventDispatcher();

    let cell, position, title;

    export let subject = {};
    let _subject = {
        cls: "",
        room: "",
        teacher: "",
        theme: "",
        subjectAbbr: "",
        subjectText: "",
        teacherAbbr: "",
        group: "",
        changed: undefined,
        changeInfo: undefined,
        special: undefined,
        ...subject
    };
    _subject.subjectText = subject.subjecttext ?? subject.subjectAbbr ?? "";
    _subject.group = ($scheduleParams.mode.id === "Other" ? subject.cls + " " : "") + (subject.group ?? "");

    title =
        _subject.special ??
        [
            `${_subject.theme ? _subject.theme + "\n\n" : ""}${_subject.subjectText}`,
            `${_subject.teacher}`,
            `${_subject.changed && _subject.changeInfo ? _subject.changeInfo : _subject.room}${
                _subject.group ? " - " + _subject.group : ""
            }`
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

    function showSubjectInfoScreen() {
        position = getPosition(cell);

        if (window.innerWidth / window.innerHeight > 3 / 4) {
            isSubjectInfoVisible.set(true);
            // the actual value is stored separately so updating it won't show all the cells at once
            _subjectInfoVisible = true;
        } else {
            dispatch("modalOpen", { type: "SubjectInfoModal", context: { subject: _subject } });
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="subject"
    class:changed={_subject.changed}
    class:changed2={_subject.special}
    class:floating={_subjectInfoVisible}
    on:click={showSubjectInfoScreen}
    bind:this={cell}
>
    {#if _subjectInfoVisible}
        <SubjectInfo data={{ position, ...{ subject: _subject } }} on:modalOpen />
    {/if}
    <div class="subject-content" {title}>
        <div class="top">
            <div class="left">{_subject.group}</div>
            <div class="right">{_subject.room}</div>
        </div>
        <div class="middle">{_subject.special ?? _subject.subjectAbbr}</div>
        <div class="bottom">{_subject.teacherAbbr ?? ""}</div>
    </div>
</div>
