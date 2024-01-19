<script lang="ts">
    import { addRipple } from "$lib/ripple";

    import { joinText } from "$lib/utilities";

    import { scheduleParams } from "$stores/config";

    import styles from "$styles/modules/Schedule.module.scss";
    import type { NormalLesson } from "@/classes";

    let cell: HTMLDivElement;

    export let bakalari: NormalLesson;

    export let row: number;
    export let column: number;

    $: height = bakalari.split ? 1 : 2;
    $: row = bakalari.split ? row + ((bakalari.groups[0].number! + 1) % 2) : row;

    let visible = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class={`${styles.subject} ${styles.cell} active`}
    class:changed={bakalari.change !== null}
    class:floating={visible}
    style={`--row: ${row}; --column: ${column}; --width: 1; --height: ${height}`}
    on:click={() => (visible = !visible)}
    bind:this={cell}
    use:addRipple
>
    <!-- <SubjectInfo {cell} subject={lesson} bind:visible /> -->

    <div class={styles.content} title={bakalari.title}>
        <div class="top">
            <div class="left">
                {#if bakalari.hasIdenticalGroups}
                    ** {bakalari.groups[0].number}.sk
                {:else if bakalari.groups.length > 2}
                    {bakalari.groups.length} skupin
                {:else}
                    {joinText(" + ", ...bakalari.groups.map((group) => group.name))}
                {/if}
            </div>

            {#if $scheduleParams.scheduleMode !== "Room"}
                <div class="right">{bakalari.room.name}</div>
            {/if}
        </div>

        <div class="middle">{bakalari.subject?.id ?? "???"}</div>

        {#if bakalari.teacher}
            <div class="bottom">{bakalari.teacher.abbreviation}</div>
        {/if}
    </div>
</div>
