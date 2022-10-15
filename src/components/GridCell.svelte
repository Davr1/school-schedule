<script>
    import { isSubjectInfoVisible } from "../mainStore";
    export let subject = {};
    let cell, elementSize, x, y, windowX, windowY;

    let room = subject.room ?? "";
    let teacher = subject.teacher ?? "";
    let theme = subject.theme ?? "";
    let subjectText = subject.subjecttext ?? "";
    let subjectAbbr = subject.subjectAbbr ?? "";
    let teacherAbbr = subject.teacherAbbr ?? "";
    let group = subject.group ?? "";
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

    function showSubjectInfoScreen() {
        elementSize = cell.getBoundingClientRect();
        x = elementSize.left + elementSize.width / 2;
        y = elementSize.top + elementSize.height / 2;
        windowX = document.body.clientWidth / 2;
        windowY = document.body.clientHeight / 2;
        if (windowX / windowY > 3 / 4) {
            isSubjectInfoVisible.set(true);
            // the actual value is stored separately so updating it won't show all the cells at once
            _subjectInfoVisible = true;
        }
    }
</script>

<div
    class="subject"
    class:changed
    class:changed2={subject.special}
    class:floating={_subjectInfoVisible}
    {title}
    on:click={showSubjectInfoScreen}
    bind:this={cell}
>
    {#if _subjectInfoVisible}
        <div
            id="subject-info"
            style:left={x < windowX ? "100%" : undefined}
            style:right={x > windowX ? "100%" : undefined}
            style:top={y < windowY ? "0" : undefined}
            style:bottom={y > windowY ? "0" : undefined}
            style:text-align={x > windowX ? "right" : undefined}
        >
            <h1>{specialChange ?? theme}</h1>
            <h2>{subjectText.split("|")[0]} ({room}{group ? " / " + group : ""})</h2>
            <h2>{teacher}</h2>
        </div>
    {/if}
    <div class="subject-content">
        <div class="top">
            <div class="left">{group}</div>
            <div class="right">{room}</div>
        </div>
        <div class="middle">{specialChange ?? subjectAbbr}</div>
        <div class="bottom">{teacherAbbr}</div>
    </div>
</div>
