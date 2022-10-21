<script>
    import ChevronDownIcon from "../assets/icons/chevronDown.svg";

    export let options = [];
    export let activeOption = {};
    export let callback = (a) => a;
    export let genericName = "";
    export let genericKey = "";

    let isVisible = false;

    function handleClick() {
        if (!isVisible) {
            isVisible = true;
            setTimeout(() => {
                const handleDropdownClicks = () => {
                    document.removeEventListener("click", handleDropdownClicks);
                    isVisible = false;
                };
                document.addEventListener("click", handleDropdownClicks);
            });
        }
    }
</script>

<div class="dropdown" class:isVisible>
    <button class="dropdownButton" on:click={handleClick}>{activeOption[genericName]} <ChevronDownIcon /></button>
    {#if isVisible}
        <div class="options">
            {#each options as option}
                <button class="option" class:active={activeOption[genericKey] === option[genericKey]} on:click={() => callback(option)}>
                    {option[genericName]}
                </button>
            {/each}
        </div>
    {/if}
</div>
