<script lang="ts">
    import { AccentColor, BackgroundColor, Theme, config } from "$stores/config";

    import Switch from "$components/Switch.svelte";

    import Dropdown from "$components/Dropdown.svelte";
    import styles from "$styles/modules/Settings.module.scss";

    const themeDropdownOptions = Object.entries(Theme).map(([name, value]) => ({ name, value }));
    const lightDropdownOptions = themeDropdownOptions.filter(({ value }) => value !== Theme.Dark);
    const darkDropdownOptions = themeDropdownOptions.filter(({ value }) => value !== Theme.Light);
    $: lightDropdownOption = themeDropdownOptions.find(({ value }) => value === $config.light)!;
    $: darkDropdownOption = themeDropdownOptions.find(({ value }) => value === $config.dark)!;

    const backgroundColorOptions = Object.entries(BackgroundColor).map(([name, value]) => ({ name, value }));
    const accentColorOptions = [...backgroundColorOptions, ...Object.entries(AccentColor).map(([name, value]) => ({ name, value }))];
    $: backgroundColorOption = backgroundColorOptions.find(({ value }) => value === $config.background)!;
    $: primaryAccentOption = accentColorOptions.find(({ value }) => value === $config.primary)!;
    $: secondaryAccentOption = accentColorOptions.find(({ value }) => value === $config.secondary)!;
</script>

<div class={styles.optionRow}>
    <span>Use system theme</span>

    <Switch bind:value={$config.system} />
</div>
<p>The app will follow the system theme.</p>

<!--
    When system is false, "light" is called "Active Theme". When system is true, "light" is called "Light Theme".
    This is because when system is false, the dark mode option is hidden.
-->
<div class={styles.optionRow}>
    {#if $config.system}
        <span>Light Theme</span>
    {:else}
        <span>Active Theme</span>
    {/if}

    <Dropdown
        options={$config.system ? lightDropdownOptions : themeDropdownOptions}
        activeOption={lightDropdownOption}
        callback={({ value }) => ($config.light = value)}
        genericKey="value"
        genericName="name"
    />
</div>

<!--
    When system is false, "dark" is hidden.
-->
{#if $config.system}
    <div class={styles.optionRow}>
        <span>Dark Theme</span>

        <Dropdown
            options={darkDropdownOptions}
            activeOption={darkDropdownOption}
            callback={({ value }) => ($config.dark = value)}
            genericKey="value"
            genericName="name"
        />
    </div>
{/if}

<!--    
    Background color

    Although all accent colors are supported, why would you use them?
-->
<div class={styles.optionRow}>
    <span>Background color</span>

    <Dropdown
        options={backgroundColorOptions}
        activeOption={backgroundColorOption}
        callback={({ value }) => ($config.background = value)}
        genericKey="value"
        genericName="name"
    />
</div>

<!--
    Primary accent

    Used throughout the app for pretty much everything.
-->
<div class={styles.optionRow}>
    <span>Primary accent</span>

    <Dropdown
        options={accentColorOptions}
        activeOption={primaryAccentOption}
        callback={({ value }) => ($config.primary = value)}
        genericKey="value"
        genericName="name"
    />
</div>

<!--
    Secondary accent

    Used for special lessons and that stuff...
-->
<div class={styles.optionRow}>
    <span>Secondary accent</span>

    <Dropdown
        options={accentColorOptions}
        activeOption={secondaryAccentOption}
        callback={({ value }) => ($config.secondary = value)}
        genericKey="value"
        genericName="name"
    />
</div>
