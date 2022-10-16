<script>
    import { scheduleParams } from "../mainStore";
    import TextSnippet from "../assets/icons/textSnippet.svg";
    import Info from "../assets/icons/info.svg";
    import Person from "../assets/icons/person.svg";

    export let data = { position: {}, subject: {} };

    let leftOffset = data.position.x < data.position.windowX ? "100%" : undefined;
    let rightOffset = data.position.x > data.position.windowX ? "100%" : undefined;
    let topOffset = data.position.y < data.position.windowY ? "0" : undefined;
    let bottomOffset = data.position.y > data.position.windowY ? "0" : undefined;

    let { specialChange, theme, subjectText, room, group, teacherAbbr, teacher } = data.subject;

    function updateScheduleParams(newParams = {}) {
        scheduleParams.update((o) => ({ ...o, ...newParams }));
    }
</script>

<div id="subject-info" style:left={leftOffset} style:right={rightOffset} style:top={topOffset} style:bottom={bottomOffset}>
    {#if specialChange || theme}
        <h1><TextSnippet /> {specialChange ?? theme}</h1>
    {/if}
    <h2>
        <Info />
        {subjectText.split("|")[0]}
        <span class="link" on:click={() => updateScheduleParams({ mode: "Other", type: "room", value: room })}>
            {room}{group ? " / " + group : ""}
        </span>
    </h2>
    <h2>
        <Person />
        <span class="link" on:click={() => updateScheduleParams({ mode: "Other", type: "teacher", value: teacherAbbr })}>
            {teacher}
        </span>
    </h2>
</div>
