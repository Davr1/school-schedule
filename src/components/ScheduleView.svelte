<script lang="ts">
    // todo: rewrite this entire file 💖

    import { createEventDispatcher } from "svelte";

    import { browser } from "$app/environment";
    import { getBakaSchedule, type BakalariSchedule } from "$lib/scraping";
    import { StandardSubject, Subject } from "$lib/subject";
    import { getWebSchedule, isMergable, joinText, parseGroup } from "$lib/utilities";

    import { config, scheduleParams, type ScheduleParams } from "$stores/config";
    import { cache, fetchCount, fetchQueue } from "$stores/main";
    import { hours, scheduleMetadata } from "$stores/static";

    import GridCell from "$components/GridCell.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    const dispatch = createEventDispatcher<{ state: "fetching" | "rendered" | "finished" }>();

    let scheduleData: BakalariSchedule = [];

    let today = new Date().getDay();

    let saturdayOverride: boolean, useWeb: boolean;
    $: (saturdayOverride = $config.saturdayOverride), (useWeb = $config.useWeb);
    // svelte magic - this line runs when any of the variables change, including the scheduleParams store itself
    $: browser && (saturdayOverride, useWeb, updateSchedule($scheduleParams));

    async function updateSchedule(schedule: ScheduleParams) {
        schedule = structuredClone(schedule);

        $fetchCount = 0;

        // unique id for this specific queue of requests; prevents incorrect schedule merging
        $fetchQueue = Symbol();
        let localFetchQueue = $fetchQueue;

        fetchProcess: {
            dispatch("state", "fetching");
            // Show the next week if it's Saturday (or Sunday) and the user has enabled the option
            if ($scheduleParams.weekMode === "Current" && $config.saturdayOverride && (today === 0 || today === 6)) {
                schedule.weekMode = "Next";
            }

            scheduleData = await getBakaSchedule(schedule, $cache);
            dispatch("state", "rendered");
            if (localFetchQueue !== $fetchQueue) break fetchProcess;
            fetchCount.update((v) => (v += 1));

            if ($scheduleParams.weekMode === "Permanent" || $scheduleParams.scheduleMode !== "Class" || $config.useWeb === false)
                break fetchProcess;

            let alternativeSchedule: ReturnType<typeof getWebSchedule>[] = [];

            const currentDate = new Date();

            for (let day of scheduleData) {
                const [d, m] = day.date[1].match(/\d+/g) ?? [];
                const tempDate = new Date(currentDate.getFullYear(), parseInt(m) - 1, parseInt(d ?? "") + 7);

                const date = new Date(currentDate.getFullYear() + (tempDate < currentDate ? 1 : 0), parseInt(m) - 1, parseInt(d ?? ""));

                // begin fetching each day asynchronously
                alternativeSchedule.push(getWebSchedule(date));
            }

            for (let [x, day] of scheduleData.entries()) {
                if (localFetchQueue !== $fetchQueue) break fetchProcess;
                let response = await alternativeSchedule[x];
                fetchCount.update((v) => (v += 1));

                for (let [i, subject] of response.find((e) => e.cls.slice(1) === schedule.value.slice(1))?.subjects.entries() ?? []) {
                    subject?.forEach((s) => {
                        const found = day.subjects[i].findIndex((a) => a.isStandard() && s.isStandard() && a.groups[0] === s.groups[0]);

                        if (found !== -1) {
                            const foundSubject = day.subjects[i][found]; // this is repeated a lot..

                            // if one isn't standard, we can't merge them. just console.error and move on
                            // This kinda fixes #10 (i think).
                            // But it's a very trashy fix and probably breaks something else.
                            if (!foundSubject.isStandard() || !s.isStandard()) return console.error(day.subjects[i], s);

                            let name = s.name || foundSubject.name;
                            let theme = s.theme || foundSubject.theme;
                            if (foundSubject.abbreviation !== s.abbreviation) {
                                name = s.abbreviation;
                                theme = "";
                            }

                            let teacher = foundSubject.teacher || s.teacher;
                            if (foundSubject.teacher.abbreviation !== s.teacher.abbreviation) {
                                let teacherName =
                                    scheduleMetadata.teachers.find((o) => o.abbr === s.teacher.abbreviation)?.name ??
                                    s.teacher.abbreviation;

                                teacher = { name: teacherName, abbreviation: s.teacher.abbreviation };
                            }

                            // create a new subject (ig? don't ask me. i only rewrote the original but with type safety)
                            const temp = new StandardSubject({
                                subject: name,
                                abbreviation: s.abbreviation || foundSubject.abbreviation,
                                theme,
                                teacher,
                                groups: [s.groups[0] || foundSubject.groups[0]],
                                room: s.room || foundSubject.room,
                                change: s.change
                            });

                            day.subjects[i][found] = temp;
                        } else {
                            console.error(day.subjects[i], s);
                        }
                    });
                }
                scheduleData = scheduleData;
            }
        }
        dispatch("state", "finished");
    }

    type Grid = GridRow[];

    interface GridRow {
        date: readonly [string, string];
        subjects: GridCell[][];
    }

    interface GridCell {
        subject: Subject;
        row: number;
        column: number;
        width: number;
        height: number;
        id: symbol;
    }

    function createGrid(schedule: BakalariSchedule) {
        let grid: Grid = schedule.map(({ date, subjects }, i) => ({
            date,
            subjects: subjects.map((subject, j) =>
                subject
                    .slice(0, 2)
                    .sort((a, b) => (a.isStandard() && b.isStandard() && parseGroup(a.groups[0]) - parseGroup(b.groups[0])) || 0)
                    .map((group, k): GridCell => {
                        // odd groups are placed on the top, even groups on the bottom. If there are two groups per cell, order them by group number
                        let half = 0;
                        let height = 2;
                        let width = 1;
                        if (group.isStandard() && group.groups.length === 1) {
                            const groupN = parseGroup(group.groups[0]);
                            half = (subject.length === 1 && ((groupN || 1) + 1) % 2) || k;
                            if (subject.length > 1 || groupN) height = 1;
                        }

                        // full day events should be 6 wide
                        if (group.isSpecial() && subjects.filter((s) => s.length).length === 1) width = 6;

                        return { subject: group, row: i * 2 + half, column: j, width, height, id: group.id };
                    })
            )
        }));

        if (!$config.mergeSubjects) return grid;

        grid.forEach(({ subjects }) => {
            // first merge subjects vertically in the same cell
            subjects.forEach((currentCell) => {
                const [first, second] = currentCell;

                if (!first?.subject.isStandard() || !second?.subject.isStandard()) return;

                if (isMergable(first.subject, second.subject, true)) {
                    currentCell.pop();

                    first.height = 2;
                    first.subject = new StandardSubject({
                        ...first.subject,
                        subject: first.subject.name,
                        cls: first.subject.className,
                        change: first.subject.change || second.subject.change,
                        theme: joinText("; ", first.subject.theme, second.subject.theme),
                        groups: [...first.subject.groups, ...second.subject.groups]
                    });
                }
            });

            // then merge adjacent subjects with similar metadata
            subjects.forEach((currentCell, i) => {
                currentCell.forEach((groupCell) => {
                    const { subject } = groupCell;

                    if (!subject.isStandard()) return;

                    for (let offset = i + 1; offset < subjects.length; offset++) {
                        const nextCell = subjects[offset];

                        let mergableGroupIdx = nextCell.findIndex(
                            (group) => group.subject.isStandard() && isMergable(group.subject, subject)
                        );

                        if (mergableGroupIdx === -1) break;

                        // prevent overlaps
                        if (nextCell.length === 2 && nextCell[0].height !== groupCell.height) break;

                        // remove duplicate subject
                        let mergableSubject = nextCell.splice(mergableGroupIdx, 1)[0].subject as StandardSubject;
                        groupCell.width++;

                        // prevent overlaps
                        if (nextCell.length === 1 && nextCell[0].row === groupCell.row) {
                            nextCell[0].row = groupCell.row % 2 ? groupCell.row - 1 : groupCell.row + 1;
                        }

                        groupCell.subject = new StandardSubject({
                            ...subject,
                            subject: subject.name,
                            cls: subject.className,
                            change: subject.change || mergableSubject.change,
                            theme: joinText("; ", subject.theme, mergableSubject.theme)
                        });
                    }
                });
            });
        });

        return grid;
    }
</script>

<main class={styles.view}>
    <div class={styles.hours}>
        {#each hours.formattedTime as [from, until], index}
            <div class={styles.hour}>
                <div class={styles.num}>{index + 1}</div>

                <span>{from} - {until}</span>
            </div>
        {/each}
    </div>
    {#key $config.mergeSubjects}
        <div class={styles.grid}>
            {#each createGrid(scheduleData) as day, i}
                <div class={styles.day} style:grid-row={`${1 + i * 2} / span 2`}>
                    <span>{day.date[0]}</span>

                    <span>{day.date[1]}</span>
                </div>

                {#each day.subjects as cell, j}
                    {#if cell.length > 0}
                        {#each cell as subject (subject.id)}
                            <!-- Omit id from the subject before passing it to the GridCell component to avoid a warning -->
                            {@const { id, ...cell } = subject}

                            <GridCell {...cell} on:modalOpen />
                        {/each}
                    {:else}
                        <div class={styles.cell} style={`--row: ${i * 2}; --column: ${j}; --width: 1; --height: 2;`}></div>
                    {/if}
                {/each}
            {/each}
        </div>
    {/key}
</main>
