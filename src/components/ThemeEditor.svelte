<script lang="ts">
    import theme, { AccentColor, BackgroundColor, Theme } from "$stores/theme";

    import RoundSelect from "$components/Controls/RoundSelect.svelte";
    import themeStyles from "$styles/modules/Controls/RoundSelect.module.scss";
    import styles from "$styles/modules/Settings.module.scss";

    const colors = [...Object.entries(BackgroundColor), ...Object.entries(AccentColor)];

    enum AccentSelection {
        Primary = "1",
        Secondary = "2"
    }

    let accent = AccentSelection.Primary;
</script>

<!--
    The theme of the app

    To edit entries, go to src/stores/config.ts and edit the Theme enum
-->
<div class={styles.optionRow}>
    <span>Active Theme</span>
</div>

<p>Note: The original theme doesn't support custom accent colors</p>

<RoundSelect options={Object.entries(Theme)} bind:selection={$theme.active} id="theme" />

<!-- Don't render the color accents if the theme doesn't support them -->
{#if $theme.active !== Theme.Original}
    <!--
        Accent color

        This is a combination of both the background and accent colors..
        again they can be found in the enums in src/stores/config.ts
    -->

    <div class={styles.optionRow} style="margin-top: 1rem;">
        <span class={themeStyles.accentTitle}>Accent color</span>

        <RoundSelect
            options={[
                ["1", AccentSelection.Primary, $theme.primary],
                ["2", AccentSelection.Secondary, $theme.secondary]
            ]}
            bind:selection={accent}
            id="accent"
            small
        />
    </div>

    <p>
        Currently selecting the
        <!-- apply the accent class depending on the selection, this is to show the currently selected color -->
        <span class={`${accent === AccentSelection.Primary ? $theme.primary : $theme.secondary} ${themeStyles.accentLabel}`}>
            {accent === AccentSelection.Primary ? "primary" : "secondary"}
        </span>
        accent.

        <br />

        Tap the option above to switch between them.
    </p>

    {#if accent === AccentSelection.Primary}
        <RoundSelect options={colors} bind:selection={$theme.primary} id="primary" small />
    {:else}
        <RoundSelect options={colors} bind:selection={$theme.secondary} id="secondary" small />
    {/if}

    <!--    
        Background color

        Only a select few colors are available, to add more, go to src/stores/config.ts-
        and edit the BackgroundColor enum and add the appropriate color variables
    -->
    <div class={styles.optionRow}>
        <span>Background color</span>
    </div>

    <p>If you're unsure, go with Zinc...</p>

    <RoundSelect options={Object.entries(BackgroundColor)} bind:selection={$theme.background} id="background" />
{/if}

<!-- for spacing -->
<br />
