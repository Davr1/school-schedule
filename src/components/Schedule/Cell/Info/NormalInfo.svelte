<script lang="ts">
    import type { NormalCell } from "$lib/schedule";

    import { config } from "$stores/config";

    import InfoIcon from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    import Info from "$components/Schedule/Cell/Info/Info.svelte";
    import Link from "$components/Schedule/Cell/Info/Link.svelte";

    export let cell: NormalCell;
    export let node: HTMLElement;
</script>

<Info {node} on:close popoverClass={cell.change ? "primary" : ""}>
    {#if $config.debug}
        <pre>{JSON.stringify(cell, null, 4)}</pre>
    {:else}
        {#each cell.topics as topic}
            <h2><TextSnippet /> {topic}</h2>
        {/each}

        <h2>
            <InfoIcon />

            {#if cell.subject}
                {cell.subject.name ?? cell.subject.id}
            {/if}

            {#if cell.room}
                <Link detail={cell.room} />
            {:else}
                mim
            {/if}

            {#if cell.groups.length > 0}
                / {cell.groups.map((group) => group.name).join(", ")}
            {/if}
        </h2>

        {#if cell.teacher}
            <h2>
                <Person />

                <Link detail={cell.teacher} />
            </h2>
        {/if}
    {/if}
</Info>
