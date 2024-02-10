<script lang="ts">
    import { DetailType } from "@school-schedule/api/classes";

    import { page } from "$app/stores";
    import type { NormalCell } from "$lib/schedule";

    import { config } from "$stores/config";

    import InfoIcon from "@material-design-icons/svg/filled/info.svg?component";
    import Person from "@material-design-icons/svg/filled/person.svg?component";
    import TextSnippet from "@material-design-icons/svg/filled/text_snippet.svg?component";

    import Info from "$components/Schedule/Cell/Info/Info.svelte";
    import Link from "$components/Schedule/Cell/Info/Link.svelte";

    export let cell: NormalCell;
    export let node: HTMLElement;

    // Kind of a hack to get the type of the selected detail
    $: type = $page.data.detail.type as DetailType;
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

            {#if type !== DetailType.Room}
                <Link detail={cell.room}>{cell.room?.name ?? "mim"}</Link>
            {/if}

            {#each cell.groups as group, i}
                <!-- Separate the groups with a comma and add a slash before the first one -->
                {i === 0 ? "/" : ","}

                <Link detail={group.class}>{group.name}</Link>
            {/each}
        </h2>

        {#if cell.teacher}
            <h2>
                <Person />

                <Link detail={cell.teacher}>{cell.teacher.fullName}</Link>
            </h2>
        {/if}
    {/if}
</Info>
