<script lang="ts" context="module">
    export interface Colors {
        background: string;
        accent: string;

        icon: {
            background: string;
            foreground: string;
        };
    }

    const colors = writable<Colors | undefined>();
    const readableColors = { subscribe: colors.subscribe } as Readable<Colors | undefined>;

    export { readableColors as colors };
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { writable, type Readable } from "svelte/store";

    import { browser } from "$app/environment";
    import inline from "$lib/inline?raw&minify";
    import { SystemTheme, update } from "$lib/theme";
    import theme, { Theme } from "$stores/theme";

    // Add a listener for the system theme
    // And also a listener for subsequent changes to the theme config
    // Note: The initial theme switch is done by the inline script below
    onMount(() => {
        // Get the system theme
        const match = window.matchMedia("(prefers-color-scheme: dark)");

        // Watch for changes
        const change = (ev: MediaQueryListEvent) => update($theme, ev.matches ? SystemTheme.Dark : SystemTheme.Light);
        match.addEventListener("change", change);

        theme.subscribe((c) => {
            const match = window.matchMedia("(prefers-color-scheme: dark)");
            const systemTheme = match.matches ? SystemTheme.Dark : SystemTheme.Light;

            // Update the theme
            update(c, systemTheme);
        });

        return () => match?.removeEventListener("change", change);
    });

    // On load, set the colors to the actual values of the CSS variables
    let icon: string = "zinc-blue";
    let favicon: HTMLLinkElement;

    $: {
        if (!browser) break $;

        // Get the actual values of the css variables
        const style = getComputedStyle(document.documentElement);

        // Replace the values in the colors object
        $colors = {
            background: style.getPropertyValue("--app-background"),
            accent: style.getPropertyValue("--accent-primary"),

            icon: {
                background: style.getPropertyValue("--icon-bg"),
                foreground: style.getPropertyValue("--icon-fg")
            }
        };

        // Update the other icons to match
        icon = $theme.active === Theme.Original ? "original-original" : `${$theme.background}-${$theme.primary}`;

        // Update the favicon "original" attribute, if it exists (See Icon/Favicon.svelte)
        if (favicon?.dataset.original) favicon.dataset.original = `/icons/svg/${icon}`;
    }
</script>

<!--
    @component
    A helper component that handles the theme of the app.
    It listens for changes to the system theme and user configuration to update the theme and icon.
-->

<svelte:head>
    {#if $colors?.background}
        <!-- Set the theme color to the background color, for the PWA -->
        <meta name="theme-color" content={$colors.background} />
    {/if}

    <link rel="icon" id="favicon" href="/icons/svg/{icon}" type="image/svg+xml" bind:this={favicon} />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/png/180/2/0/{icon}" type="image/png" />

    <!-- Inline script that sets the theme based on the user's preference before js is loaded -->
    {@html `<script>${inline}</script>`}
</svelte:head>
