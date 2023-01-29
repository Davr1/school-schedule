<script>
    import { updateScheduleParams } from "../configStore";
    import { scheduleMetadata } from "../staticStore";
    import TextSnippet from "../assets/icons/textSnippet.svg";
    import Info from "../assets/icons/info.svg";
    import Person from "../assets/icons/person.svg";

    export let data = { position: {}, subject: {} };

    let leftOffset, rightOffset, topOffset, bottomOffset, maxWidth;

    leftOffset = data.position.x < data.position.windowX ? "100%" : undefined;
    rightOffset = data.position.x > data.position.windowX ? "100%" : undefined;
    topOffset = data.position.y < data.position.windowY ? "0" : undefined;
    bottomOffset = data.position.y > data.position.windowY ? "0" : undefined;
    maxWidth =
        data.position.x < data.position.windowX
            ? `${data.position.windowWidth - data.position.size.x - data.position.size.width - 90}px`
            : `${data.position.size.x - 90}px`;

    let { special, theme, subject, room, group, teacherAbbr, teacher } = data.subject;
</script>

<div
    id="subject-info"
    style:left={leftOffset}
    style:right={rightOffset}
    style:top={topOffset}
    style:bottom={bottomOffset}
    style:max-width={maxWidth}
>
    {#if special || theme}
        <h1><TextSnippet /> {special ?? theme}</h1>
    {/if}
    {#if group || room}
        <h2>
            <Info />
            {subject.split("|")[0]}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="link" on:click={() => updateScheduleParams({ mode: "Other", type: "room", value: room })}>
                {room}
            </span>
            {#if group}
                /
                {#if scheduleMetadata.classes.find((a) => a.name === group.trim().split(" ")[0])}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span class="link" on:click={() => updateScheduleParams({ class: group.trim().split(" ")[0], mode: "Actual" })}>
                        {group}
                    </span>
                {:else}
                    {group}
                {/if}
            {/if}
        </h2>
    {/if}
    {#if teacher}
        <h2>
            <Person />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="link" on:click={() => updateScheduleParams({ mode: "Other", type: "teacher", value: teacherAbbr })}>
                {teacher}
            </span>
        </h2>
    {/if}
</div>
