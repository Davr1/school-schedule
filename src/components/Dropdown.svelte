<script lang="ts">
    import { getPosition } from "$lib/utilities";

    import ExpandMore from "@material-design-icons/svg/filled/expand_more.svg?component";

    type T = $$Generic;

    export let options: readonly T[] = [];
    export let activeOption: T;
    export let callback: (option: T) => void = () => {};
    export let genericName: keyof T;
    export let genericKey: keyof T;

    let isVisible = false;

    let dropdownButton: HTMLButtonElement;

    let top: string | undefined, bottom: string | undefined, transform: string, maxHeight: string;

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
                ? `${position.size.top - position.containerSize.top - 40}px`
                : `${position.containerSize.bottom - position.size.bottom - 40}px`;
    }
</script>

<div class="dropdown" class:visible={isVisible}>
    <button class="dropdown-button styled-button" on:click={handleClick} bind:this={dropdownButton}>
        {activeOption[genericName]}
        <ExpandMore />
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
