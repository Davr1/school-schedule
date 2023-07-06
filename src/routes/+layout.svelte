<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    import { update } from "$lib/theme";

    import { config } from "$stores/config";

    import "$styles/index.scss";

    let match: MediaQueryList | undefined;

    function updateMatch(ev: MediaQueryListEvent) {
        update($config, ev.matches ? "dark" : "light");
    }

    // On mount, perform a theme update (because the server doesn't know the user's theme)
    onMount(async () => {
        // Get the system theme
        match = window.matchMedia("(prefers-color-scheme: dark)");
        const systemTheme = match.matches ? "dark" : "light";

        // Watch for changes
        match.addEventListener("change", updateMatch);

        config.subscribe((c) => {
            const match = window.matchMedia("(prefers-color-scheme: dark)");
            const systemTheme = match.matches ? "dark" : "light";

            // Update the theme
            update(c, systemTheme);
        });

        update($config, systemTheme);
    });

    onDestroy(() => {
        match?.removeEventListener("change", updateMatch);
    });
</script>

<slot />
