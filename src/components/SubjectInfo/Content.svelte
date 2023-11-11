<script lang="ts">
    import type { Subject } from "$lib/subject";

    import { scheduleParams } from "$stores/config";

    import Info from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    import ContentRow from "$components/SubjectInfo/ContentRow.svelte";
    import Link from "$components/SubjectInfo/Link.svelte";

    export let subject: Subject;
</script>

{#if subject.isSpecial()}
    <ContentRow><TextSnippet slot="icon" /> {subject.name}</ContentRow>
{:else if subject.isStandard() && subject.theme}
    {#each subject.theme
        .split("; ")
        .map((t) => t.trim())
        .filter(Boolean) as theme, i}
        <ContentRow><TextSnippet slot="icon" /> {theme}</ContentRow>
    {/each}
{/if}

{#if subject.isStandard()}
    <ContentRow>
        <Info slot="icon" />

        {subject.name.split("|")[0]}

        {#if $scheduleParams.scheduleMode !== "Room"}
            <Link params={{ scheduleMode: "Room", value: subject.room }} />
            {#if subject.groups.filter(Boolean).length > 0}/{/if}
        {/if}

        {#each subject.groups.filter(Boolean) as singleGroup}
            <Link text={singleGroup} params={{ scheduleMode: "Class", value: singleGroup.trim().split(" ")[0] }} />
            &ensp;
        {/each}
    </ContentRow>
    {#if $scheduleParams.scheduleMode !== "Teacher" && subject.teacher.name}
        <ContentRow>
            <Person slot="icon" />
            <Link text={subject.teacher.name} params={{ scheduleMode: "Teacher", value: subject.teacher.abbreviation.split(",")[0] }} />
        </ContentRow>
    {/if}
{/if}
