<script>
    import { fetchCount, fetchQueue } from "../mainStore";
    import { hours, modes, scheduleMetadata } from "../staticStore";
    import { getBakaSchedule, getWebSchedule, getWebScheduleAlt } from "../utilities";
    import { config, scheduleParams } from "../configStore";
    import GridCell from "./GridCell.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let scheduleData = [];

    scheduleParams.subscribe((data) => updateSchedule(data));

    async function updateSchedule(schedule) {
        schedule = structuredClone(schedule);

        $fetchCount = 0;

        // unique id for this specific queue of requests; prevents incorrect schedule merging
        $fetchQueue = Symbol();
        let localFetchQueue = $fetchQueue;

        fetchProcess: if ($scheduleParams.mode.id !== "Other") {
            if ($scheduleParams.mode.id === "Actual" && $config.sundayOverride && new Date().getDay() === 0) {
                schedule.mode = modes.search("name", "Next");
            }

            scheduleData = await getBakaSchedule(schedule);
            dispatch("loadingFinished");
            if (localFetchQueue !== $fetchQueue) break fetchProcess;
            fetchCount.update((v) => (v += 1));

            if ($scheduleParams.mode.id === "Permanent" || $config.useWeb === false) return;

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

                for (let [i, subject] of response.find((e) => e.cls.slice(1) === schedule.class.name.slice(1))?.subjects.entries() ?? []) {
                    subject?.forEach((s) => {
                        const found = day.subjects[i].findIndex((a) => a.group === s.group);

                        if (found !== -1) {
                            let temp = { ...day.subjects[i][found], ...s };
                            if (day.subjects[i][found].subjectAbbr !== s.subjectAbbr) {
                                temp.subject = s.subjectAbbr;
                                temp.theme = "";
                            }
                            if (day.subjects[i][found].teacherAbbr !== s.teacherAbbr) {
                                temp.teacher = scheduleMetadata.teachers.find((o) => o.abbr === s.teacherAbbr)?.name ?? s.teacherAbbr;
                            }

                            day.subjects[i][found] = temp;
                        } else {
                            console.error(day.subjects[i], s);
                        }
                    });
                }
                scheduleData = scheduleData;
            }
        } else {
            scheduleData = await getWebScheduleAlt(schedule.type, schedule.value);
            fetchCount.update((v) => (v += 1));
            dispatch("loadingFinished");
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
                {#if day.date}
                    <span>{day.date[0]}</span>
                    <span>{day.date[1]}</span>
                {:else}
                    <span>{day.day}</span>
                {/if}
            </div>
            <div class="cell-container">
                {#each day.subjects as cell}
                    <div class="cell">
                        {#if cell[0]?.type !== 0}
                            {#each cell.sort((a, b) => a.group?.localeCompare(b.group)) as subject (subject.id)}
                                <GridCell {subject} on:modalOpen />
                            {/each}
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</main>
