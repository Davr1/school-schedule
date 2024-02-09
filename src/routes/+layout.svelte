<script lang="ts">
    // Fonts
    import "@fontsource/inter/latin-400.css";
    import "@fontsource/inter/latin-500.css";
    import "@fontsource/inter/latin-600.css";
    import "@fontsource/inter/latin-ext-400.css";
    import "@fontsource/inter/latin-ext-500.css";
    import "@fontsource/inter/latin-ext-600.css";

    import Theme from "$components/Theme.svelte";

    // Styles
    import "$styles/global.scss";
    import "virtual:custom-colors.css";
</script>

<Theme />

<slot />
