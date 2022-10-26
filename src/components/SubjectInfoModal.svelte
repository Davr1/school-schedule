<script>
    import { updateScheduleParams } from "../configStore";
    import TextSnippet from "../assets/icons/textSnippet.svg";
    import Info from "../assets/icons/info.svg";
    import Person from "../assets/icons/person.svg";
    import Modal from "./Modal.svelte";

    export let context = { subject: {} };

    let { specialChange, theme, subjectText, room, group, teacherAbbr, teacher } = context.subject;

    console.log(context);
</script>

<Modal on:hideScreenOverlay>
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
</Modal>
