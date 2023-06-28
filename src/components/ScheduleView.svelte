<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    import { getBakaSchedule } from "$lib/scraping";
    import { getWebSchedule } from "$lib/utilities";

    import { config, scheduleParams } from "$stores/config";
    import { fetchCount, fetchQueue } from "$stores/main";
    import { hours, scheduleMetadata } from "$stores/static";

    import GridCell from "$components/GridCell.svelte";
    import { StandardSubject } from "$lib/subject";

    const dispatch = createEventDispatcher();

    /** @type {import("$lib/scraping").BakalariSchedule} */
    let scheduleData = [];

    let scheduleParamsSubscriber;

    let today = new Date().getDay();

    // Register the subscriber on mount
    onMount(() => {
        scheduleParams.subscribe((data) => updateSchedule(data));
    });

    // On unmount, unsubscribe
    onDestroy(() => {
        scheduleParamsSubscriber?.();
    });

    async function updateSchedule(schedule) {
        schedule = structuredClone(schedule);

        $fetchCount = 0;

        // unique id for this specific queue of requests; prevents incorrect schedule merging
        $fetchQueue = Symbol();
        let localFetchQueue = $fetchQueue;

        fetchProcess: {
            if ($scheduleParams.weekMode === "Current" && $config.sundayOverride && today === 0) {
                schedule.weekMode = "Next";
            }

            scheduleData = await getBakaSchedule(schedule);
            dispatch("loadingFinished");
            if (localFetchQueue !== $fetchQueue) break fetchProcess;
            fetchCount.update((v) => (v += 1));

            if ($scheduleParams.weekMode === "Permanent" || $scheduleParams.scheduleMode !== "Class" || $config.useWeb === false) return;

            let alternativeSchedule = [];

            const currentDate = new Date();

            for (let day of scheduleData) {
                const [d, m] = day.date[1].match(/\d+/g);
                const tempDate = new Date(currentDate.getFullYear(), m - 1, d + 7);

                const date = new Date(currentDate.getFullYear() + (tempDate < currentDate ? 1 : 0), m - 1, d);

                // begin fetching each day asynchronously
                alternativeSchedule.push(getWebSchedule(date));
            }

            for (let [x, day] of scheduleData.entries()) {
                if (localFetchQueue !== $fetchQueue) break fetchProcess;
                let response = await alternativeSchedule[x];
                fetchCount.update((v) => (v += 1));

                for (let [i, subject] of response.find((e) => e.cls.slice(1) === schedule.value.slice(1))?.subjects.entries() ?? []) {
                    subject?.forEach((s) => {
                        const found = day.subjects[i].findIndex((a) => a.isStandard() && s.isStandard() && a.group === s.group);

                        if (found !== -1) {
                            const foundSubject = day.subjects[i][found]; // this is repeated a lot..

                            // if one isn't standard, we can't merge them. just console.error and move on
                            // This kinda fixes #10 (i think).
                            // But it's a very trashy fix and probably breaks something else.
                            if (!foundSubject.isStandard() || !s.isStandard()) return console.error(day.subjects[i], s);

                            /** @type {string} */
                            let name = s.name || foundSubject.name;
                            /** @type {string} */
                            let theme = s.theme || foundSubject.theme;
                            if (foundSubject.abbreviation !== s.abbreviation) {
                                name = s.abbreviation;
                                theme = "";
                            }

                            /** @type {import("$lib/subject").TeacherInfo} */
                            let teacher = s.teacher || foundSubject.teacher;
                            if (foundSubject.teacher.abbreviation !== s.teacher.abbreviation) {
                                let teacherName =
                                    scheduleMetadata.teachers.find((o) => o.abbr === s.teacher.abbreviation)?.name ??
                                    s.teacher.abbreviation;

                                teacher = { name: teacherName, abbreviation: s.teacher.abbreviation };
                            }

                            // create a new subject (ig? don't ask me. i only rewrote the original but with type safety)
                            const temp = new StandardSubject({
                                subject: name,
                                subjectAbbr: s.abbreviation || foundSubject.abbreviation,
                                theme,
                                teacher: teacher.name, // ugh, the compatibility.....
                                teacherAbbr: teacher.abbreviation, // whyy
                                group: s.group || foundSubject.group,
                                room: s.room || foundSubject.room
                            });

                            // @ts-ignore (i don't know how to fix this)
                            day.subjects[i][found] = temp;
                        } else {
                            console.error(day.subjects[i], s);
                        }
                    });
                }
                scheduleData = scheduleData;
            }
        }
    }
</script>

<main>
    <div class="hours">
        {#each hours.formattedTime as [from, until], index}
            <div class="hour-container">
                <div class="num">{index + 1}</div>
                <div class="hour">
                    <span>{from}</span>
                    -
                    <span>{until}</span>
                </div>
            </div>
        {/each}
    </div>
    {#each scheduleData as day}
        <div class="day-row">
            <div class="day">
                <span>{day.date[0]}</span>
                <span>{day.date[1]}</span>
            </div>
            <div class="cell-container">
                {#each day.subjects as cell}
                    <div class="cell">
                        {#each cell.sort( (a, b) => (!a.isStandard() || !b.isStandard() ? 0 : a.group.localeCompare(b.group)) ) as subject (subject.id)}
                            <GridCell {subject} on:modalOpen />
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</main>
