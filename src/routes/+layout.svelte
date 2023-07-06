<script lang="ts">
    import { onMount } from "svelte";

    import "$styles/index.scss";

    const primary = "blue";
    const secondary = "green";

    const background = "slate";

    // On mount, assign the theme variables to the document
    // These are loaded dynamically...
    onMount(async () => {
        const { default: colors } = await import("tailwindcss/colors");

        // Assign the theme variables to the document
        for (const [key, value] of Object.entries(colors[primary])) {
            document.documentElement.style.setProperty(`--primary-${key}`, value);
        }

        for (const [key, value] of Object.entries(colors[secondary])) {
            document.documentElement.style.setProperty(`--secondary-${key}`, value);
        }

        for (const [key, value] of Object.entries(colors[background])) {
            document.documentElement.style.setProperty(`--background-${key}`, value);
        }

        // Add the class name to the root element
        document.documentElement.classList.add("light");
    });
</script>

<slot />
