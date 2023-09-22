<script lang="ts">
    import type { Subject } from "$lib/subject";
    import { isValidMetadata } from "$lib/utilities";

    import { scheduleParams, updateScheduleParams } from "$stores/config";

    import Info from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    import modalStyles from "$styles/modules/Modal.module.scss";
    import styles from "$styles/modules/Schedule.module.scss";

    export let subject: Subject;
</script>

{#if subject.isSpecial()}
    <h1 class={modalStyles.title}>
        <span><TextSnippet /> {subject.name}</span>

        <slot name="close" />
    </h1>
{:else if subject.isStandard() && subject.theme}
    {#each subject.theme
        .split("; ")
        .map((t) => t.trim())
        .filter(Boolean) as theme, i}
        <h2 class={modalStyles.title}>
            <span><TextSnippet /> {theme}</span>

            {#if i === 0}
                <slot name="close" />
            {/if}
        </h2>
    {/each}
{/if}

{#if subject.isStandard()}
    <h2 class={modalStyles.title}>
        <span>
            <Info />

            {subject.name.split("|")[0]}

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            {#if $scheduleParams.scheduleMode !== "Room"}
                <span
                    class={styles.link}
                    on:click={() => {
                        // This is nasty. Consider refactoring..
                        if (!subject.isStandard()) return;

                        if (isValidMetadata(subject.room)) updateScheduleParams({ value: subject.room, scheduleMode: "Room" });
                    }}
                >
                    {subject.room}
                </span>
                {#if subject.groups.filter(Boolean).length > 0}/{/if}
            {/if}

            {#each subject.groups
                .map((g) => g.split(", "))
                .flat()
                .filter(Boolean) as singleGroup}
                {#if isValidMetadata(singleGroup.trim().split(" ")[0])}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <span
                        class={styles.link}
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
                &ensp;
            {/each}
        </span>

        <!-- Only show the close button if it's not already shown by the thing at the top -->
        {#if !subject.theme}
            <slot name="close" />
        {/if}
    </h2>
    {#if $scheduleParams.scheduleMode !== "Teacher" && subject.teacher.name}
        <h2>
            <Person />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                class={styles.link}
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
{/if}
