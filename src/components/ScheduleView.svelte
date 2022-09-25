<script>
    import { scheduleParams } from "../mainStore";
    import { fetchBaka, parseSchedule } from "../utilities";
    import GridCell from "./GridCell.svelte";

    let scheduleData = JSON.parse(localStorage.getItem(`schedule:${$scheduleParams.class.id}:${$scheduleParams.mode}`)) ?? [];

    scheduleParams.subscribe((data) => {
        updateSchedule(parseSchedule(fetchBaka(data)));
    });

    async function updateSchedule(scheduleRequest) {
        console.log(scheduleRequest);
        scheduleData = await scheduleRequest;
        localStorage.setItem(`schedule:${$scheduleParams.class.id}:${$scheduleParams.mode}`, JSON.stringify(scheduleData));
    }
</script>

<main>
    {#each scheduleData as day}
        <div class="day-row">
            <div class="cell-container">
                {#each day as cell}
                    <div class="cell">
                        {#if cell[0].id}
                            <div class="cell-content">
                                {#each cell as subject (subject.id)}
                                    <GridCell {subject} />
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</main>
