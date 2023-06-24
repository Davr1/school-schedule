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
            <span class="link" on:click={() => updateScheduleParams({ value: room, scheduleMode: "Room" })}>
                {room}
            </span>
            {#if group}
                /
                {#each group.split(", ") as singleGroup}
                    {#if scheduleMetadata.classes.find((a) => a.name === singleGroup.trim().split(" ")[0])}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <span
                            class="link"
                            on:click={() => updateScheduleParams({ value: singleGroup.trim().split(" ")[0], scheduleMode: "Class" })}
                        >
                            {singleGroup}
                        </span>
                    {:else}
                        {singleGroup}
                    {/if}
                {/each}
            {/if}
        </h2>
    {/if}
    {#if teacher}
        <h2>
            <Person />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="link" on:click={() => updateScheduleParams({ value: teacherAbbr.split(",")[0], scheduleMode: "Teacher" })}>
                {teacher.split(",")[0]}
            </span>
        </h2>
    {/if}
</div>
