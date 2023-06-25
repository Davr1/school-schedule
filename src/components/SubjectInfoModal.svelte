<script>
    import { updateScheduleParams } from "$stores/config";
    import { scheduleMetadata } from "$stores/static";

    import Info from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    import Modal from "$components/Modal.svelte";

    export let context = { subject: {} };

    let { special, theme, subject, room, group, teacherAbbr, teacher } = context.subject;
</script>

<Modal on:hideScreenOverlay>
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
</Modal>
