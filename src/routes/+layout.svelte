<script lang="ts">
    import fonts from "$lib/fonts";
    import { onDestroy, onMount } from "svelte";

    import { SystemTheme, update } from "$lib/theme";

    import theme from "$stores/theme";

    import Subscription from "$components/AprilFools/Subscription.svelte";
    import "$styles/global.scss";
    import "virtual:custom-colors.css";

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

<Subscription />

<!-- Preload the fonts and set the appropriate class name -->
<svelte:head>
    {#each fonts as font}
        <link rel="preload" href={font} as="font" type="font/woff2" crossorigin="anonymous" />
    {/each}

    <script>
        var theme = JSON.parse(localStorage.getItem("theme")) || {
            active: "system",
            primary: "blue",
            secondary: "green",
            background: "zinc"
        };

        var dark = matchMedia("(prefers-color-scheme: dark)").matches;

        if (theme.active === "system") {
            theme.active = dark ? "dark" : "light";
        }

        document.documentElement.classList.toggle("original", theme.active === "original");
        document.documentElement.classList.add(
            theme.active,

            theme.primary || "blue",
            (theme.secondary || "green") + "-2",
            (theme.background || "zinc") + "-bg"
        );

        document.querySelectorAll("link[rel$='icon']").forEach((node) => {
            node.href = node.href.replace(
                /zinc-blue$/,
                theme.active === "original" ? "original-original" : theme.background + "-" + theme.primary
            );
        });
    </script>
</svelte:head>

<slot />
