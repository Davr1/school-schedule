<script>
    import { scheduleParams, hours, fetchCount } from "../mainStore";
    import {
        fetchBaka,
        parseBakaSchedule,
        fetchWebSchedule,
        parseWebSchedule,
        fetchWebScheduleAlt,
        parseWebScheduleAlt
    } from "../utilities";
    import GridCell from "./GridCell.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let scheduleData = [];

    scheduleParams.subscribe((data) => updateSchedule(data));

    async function updateSchedule(schedule) {
        $fetchCount = 0;
        if ($scheduleParams.mode !== "Other") {
            scheduleData = await parseBakaSchedule(fetchBaka(schedule));
            dispatch("loadingFinished");
            if ($scheduleParams.mode === "Permanent") return;
            let alternativeSchedule = [];
            for (let day of scheduleData) {
                const date = new Date().getFullYear() + "-" + day.date[1].split("/").reverse().join("-");
                alternativeSchedule.push(parseWebSchedule(fetchWebSchedule(date)));
            }
            for (let [x, day] of scheduleData.entries()) {
                for (let [i, subject] of (await alternativeSchedule[x])
                    .find((e) => e.cls.slice(1) === schedule.class.name.slice(1))
                    ?.subjects.entries() ?? []) {
                    subject?.forEach((s) => {
                        const found = day.subjects[i].findIndex((a) => a.group === s.group);
                        day.subjects[i][found] = { ...day.subjects[i][found], ...s };
                        if (found === -1) {
                            console.error(day.subjects[i], s);
                        }
                    });
                }
                scheduleData = scheduleData;
                console.log(scheduleData);
            }
        } else {
            scheduleData = await parseWebScheduleAlt(fetchWebScheduleAlt(schedule.type, schedule.value));
            dispatch("loadingFinished");
        }
    }
</script>

<main>
    <div class="hours">
        {#each hours.time as hour, index}
            <div class="hour-container">
                <div class="num">{index + 1}</div>
                <div class="hour">
                    <span>{hour[0]}</span>
                    -
                    <span>{hour[1]}</span>
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
                        {#if cell[0]?.id}
                            {#each cell.sort((a, b) => a.group?.localeCompare(b.group)) as subject (subject.id)}
                                <GridCell {subject} />
                            {/each}
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</main>
