<script lang="ts">
    import type { Subject } from "$lib/subject";
    import { type getPosition, isValidMetadata } from "$lib/utilities";

    import { updateScheduleParams } from "$stores/config";

    import Info from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    export let position: ReturnType<typeof getPosition>;
    export let subject: Subject;

    let leftOffset: string | undefined,
        rightOffset: string | undefined,
        topOffset: string | undefined,
        bottomOffset: string | undefined,
        maxWidth: string | undefined;

    leftOffset = position.x < position.windowX ? "100%" : undefined;
    rightOffset = position.x > position.windowX ? "100%" : undefined;
    topOffset = position.y < position.windowY ? "0" : undefined;
    bottomOffset = position.y > position.windowY ? "0" : undefined;
    maxWidth =
        position.x < position.windowX
            ? `${position.windowWidth - position.size.x - position.size.width - 90}px`
            : `${position.size.x - 90}px`;
</script>

<div
    id="subject-info"
    style:left={leftOffset}
    style:right={rightOffset}
    style:top={topOffset}
    style:bottom={bottomOffset}
    style:max-width={maxWidth}
>
    {#if subject.isSpecial()}
        <h1><TextSnippet /> {subject.name}</h1>
    {:else if subject.isStandard() && subject.theme}
        <h2><TextSnippet /> {subject.theme}</h2>
    {/if}
    {#if subject.isStandard()}
        <h2>
            <Info />
            {subject.name.split("|")[0]}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span
                class="link"
                on:click={() => {
                    // This is nasty. Consider refactoring..
                    if (!subject.isStandard()) return;

                    if (isValidMetadata(subject.room)) updateScheduleParams({ value: subject.room, scheduleMode: "Room" });
                }}
            >
                {subject.room}
            </span>
            {#if subject.group}
                /
                {#each subject.group.split(", ") as singleGroup}
                    {#if isValidMetadata(singleGroup.trim().split(" ")[0])}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <span
                            class="link"
                            on:click={() => {
                                const group = singleGroup.trim().split(" ")[0];
                                if (isValidMetadata(group)) updateScheduleParams({ value: group, scheduleMode: "Class" });
                            }}
                        >
                            {singleGroup}
                        </span>
                    {:else}
                        {singleGroup}
                    {/if}
                {/each}
            {/if}
        </h2>
        <h2>
            <Person />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span
                class="link"
                on:click={() => {
                    if (!subject.isStandard()) return;

                    const teacher = subject.teacher.abbreviation.split(",")[0];
                    if (isValidMetadata(teacher)) updateScheduleParams({ value: teacher, scheduleMode: "Teacher" });
                }}
            >
                {subject.teacher.name.split(",")[0]}
            </span>
        </h2>
    {/if}
</div>
