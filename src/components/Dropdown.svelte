<script>
    import ChevronDownIcon from "../assets/icons/chevronDown.svg";
    import { getPosition } from "../utilities";

    export let options = [];
    export let activeOption = {};
    export let callback = (a) => a;
    export let genericName = "";
    export let genericKey = "";

    let isVisible = false;

    let dropdownButton;

    let top, bottom, transform, maxHeight;

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
        let position = getPosition(dropdownButton);
        top = position.y > position.windowHeight * (3 / 4) ? "-0.4rem" : undefined;
        bottom = position.y < position.windowHeight * (3 / 4) ? "-0.4rem" : undefined;
        transform = position.y > position.windowHeight * (3 / 4) ? "translateY(-100%)" : "translateY(100%)";
        maxHeight =
            position.y > position.windowHeight * (3 / 4)
                ? `${position.size.top - position.parentSize.top - 40}px`
                : `${position.parentSize.bottom - position.size.bottom - 40}px`;
    }
</script>

<div class="dropdown" class:visible={isVisible}>
    <button class="dropdown-button styled-button" on:click={handleClick} bind:this={dropdownButton}>
        {activeOption[genericName]}
        <ChevronDownIcon />
    </button>
    {#if isVisible}
        <div class="options" style:top style:bottom style:transform style:max-height={maxHeight}>
            {#each options as option (option[genericKey])}
                <button class="option" class:active={activeOption[genericKey] === option[genericKey]} on:click={() => callback(option)}>
                    {option[genericName]}
                </button>
            {/each}
        </div>
    {/if}
</div>
