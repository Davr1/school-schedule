<script lang="ts">
    import type { Subject } from "$lib/subject";
    import { addRipple } from "$lib/ripple";

    import { joinText } from "$lib/utilities";

    import { scheduleParams } from "$stores/config";

    import SubjectInfo from "$components/SubjectInfo/Universal.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    let cell: HTMLDivElement, title: string;

    export let subject: Subject;

    export let row: number;
    export let column: number;
    export let height: number;
    export let width: number;

    title = subject.isSpecial()
        ? subject.name
        : subject.isStandard()
        ? [
              subject.theme,
              " ", // Spacer
              subject.name,
              subject.teacher.name,
              `${subject.change ?? subject.room}${subject.groups?.length ? " - " + joinText(" + ", ...subject.groups) : ""}`
          ]
              .filter(Boolean)
              .join("\n")
              .trim()
        : ""; // idk what you want for empty subjects..

    /** Whether the subject info modal / popover is visible */
    let visible = false;

    // Hide the modal / popover when the schedule changes (when tf does this happen?)
    scheduleParams.subscribe(() => (visible = false));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if subject.isStandard()}
    <div
        class={`${styles.subject} ${styles.cell} active`}
        class:changed={subject.change}
        class:floating={visible}
        style={`--row: ${row}; --column: ${column}; --width: ${width}; --height: ${height}`}
        on:click={() => (visible = !visible)}
        bind:this={cell}
        use:addRipple
    >
        <SubjectInfo {cell} {subject} bind:visible />

        <div class={styles.content} {title}>
            <div class="top">
                <div class="left">{joinText(" + ", ...subject.groups)}</div>
                {#if $scheduleParams.scheduleMode !== "Room"}<div class="right">{subject.room}</div>{/if}
            </div>
            <div class="middle">{subject.abbreviation}</div>
            {#if $scheduleParams.scheduleMode !== "Teacher"}<div class="bottom">{subject.teacher.abbreviation.split(",")[0]}</div>{/if}
        </div>
    </div>
{:else if subject.isSpecial()}
    <div
        class={`${styles.subject} ${styles.cell} special`}
        class:floating={visible}
        class:active={subject.abbreviation && subject.name}
        style={`--row: ${row}; --column: ${column}; --width: ${width}; --height: ${height}`}
        on:click={() => subject.isSpecial() && subject.abbreviation && subject.name && (visible = !visible)}
        bind:this={cell}
        use:addRipple
    >
        <SubjectInfo {cell} {subject} bind:visible />

        <div class={styles.content} {title}>
            <div class="middle">{subject.abbreviation || subject.name}</div>
        </div>
    </div>
{:else if subject.isEmpty() && subject.change}
    <div
        class={`${styles.subject} ${styles.cell} special`}
        style={`--row: ${row}; --column: ${column}; --width: ${width}; --height: ${height}`}
        bind:this={cell}
    />
{/if}
