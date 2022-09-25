<script>
    import { classList, scheduleParams } from "../mainStore";
    import ChevronDownIcon from "../assets/icons/chevronDown.svg";

    let isVisible = false;

    function updateScheduleParams(newParams = {}) {
        scheduleParams.update((o) => ({ ...o, ...newParams }));
    }

    function handleClick() {
        if (!isVisible) {
            isVisible = true;
            setTimeout(() => {
                const handleDropdownClicks = () => {
                    document.removeEventListener("click", handleDropdownClicks);
                    isVisible = false;
                };
                document.addEventListener("click", handleDropdownClicks);
            }, 0);
        }
    }
</script>

<div id="dropdown" class:isVisible>
    <button id="classButton" on:click={handleClick}>
        {$scheduleParams.class.name}
        <ChevronDownIcon />
    </button>
    {#if isVisible}
        <div id="classSelect">
            {#each classList as cls}
                <button class="option" class:active={$scheduleParams.class === cls} on:click={() => updateScheduleParams({ class: cls })}>
                    {cls.name}
                </button>
            {/each}
        </div>
    {/if}
</div>
