<script lang="ts">
    import fonts from "$lib/fonts";
    import { onDestroy, onMount } from "svelte";

    import { SystemTheme, update } from "$lib/theme";

    import theme from "$stores/theme";

    import "$styles/global.scss";

    let match: MediaQueryList | undefined;

    function updateMatch(ev: MediaQueryListEvent) {
        update($theme, ev.matches ? SystemTheme.Dark : SystemTheme.Light);
    }

    // Add a listener for the system theme
    // And also a listener for subsequent changes to the theme config
    // Note: The initial theme switch is done by the inline script in index.html so it's not necessary to do it here
    onMount(async () => {
        // Get the system theme
        match = window.matchMedia("(prefers-color-scheme: dark)");

        // Watch for changes
        match.addEventListener("change", updateMatch);

        theme.subscribe((c) => {
            const match = window.matchMedia("(prefers-color-scheme: dark)");
            const systemTheme = match.matches ? SystemTheme.Dark : SystemTheme.Light;

            // Update the theme
            update(c, systemTheme);
        });
    });

    onDestroy(() => {
        match?.removeEventListener("change", updateMatch);
    });
</script>

<svelte:head>
    <!-- Preload the fonts -->
    {#each fonts as font}
        <link rel="preload" href={font} as="font" type="font/woff2" crossorigin="anonymous" />
    {/each}
</svelte:head>

<slot />
