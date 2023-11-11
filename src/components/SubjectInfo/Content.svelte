<script lang="ts">
    import type { Subject } from "$lib/subject";

    import { scheduleParams } from "$stores/config";

    import Info from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    import Link from "$components/SubjectInfo/Link.svelte";

    export let subject: Subject;
</script>

{#if subject.isSpecial()}
    <h2><TextSnippet /> {subject.name}</h2>
{:else if subject.isStandard() && subject.theme}
    {#each subject.theme
        .split("; ")
        .map((t) => t.trim())
        .filter(Boolean) as theme, i}
        <h2><TextSnippet /> {theme}</h2>
    {/each}
{/if}

{#if subject.isStandard()}
    <h2>
        <Info />

        {subject.name.split("|")[0]}

        {#if $scheduleParams.scheduleMode !== "Room"}
            <Link params={{ scheduleMode: "Room", value: subject.room }} />
            {#if subject.groups.filter(Boolean).length > 0}/{/if}
        {/if}

        {#each subject.groups.filter(Boolean) as singleGroup}
            <Link text={singleGroup} params={{ scheduleMode: "Class", value: singleGroup.trim().split(" ")[0] }} />
            &ensp;
        {/each}
    </h2>
    {#if $scheduleParams.scheduleMode !== "Teacher" && subject.teacher.name}
        <h2>
            <Person />
            <Link text={subject.teacher.name} params={{ scheduleMode: "Teacher", value: subject.teacher.abbreviation.split(",")[0] }} />
        </h2>
    {/if}
{/if}
