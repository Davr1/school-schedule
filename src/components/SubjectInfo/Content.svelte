<script lang="ts">
    import type { Subject } from "$lib/subject";
    import { isValidMetadata } from "$lib/utilities";

    import { updateScheduleParams } from "$stores/config";

    import Info from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    export let subject: Subject;
</script>

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
        <!-- svelte-ignore a11y-no-static-element-interactions -->
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
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
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
        <!-- svelte-ignore a11y-no-static-element-interactions -->
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
