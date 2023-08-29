<script>
    import { AccentColor, BackgroundColor, Theme, config } from "$stores/config";

    import Switch from "$components/Switch.svelte";

    import styles from "$styles/modules/Settings.module.scss";

    const backgroundColors = Object.entries(BackgroundColor);
    const accentColors = [...backgroundColors, ...Object.entries(AccentColor)];
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

    <select bind:value={$config.light}>
        <option value={Theme.Light}>Light</option>
        <option value={Theme.Dark}>Dark</option>
        <option value={Theme.Original}>Original</option>
    </select>
</div>

<!--
    When system is false, "dark" is hidden.
-->
{#if $config.system}
    <div class={styles.optionRow}>
        <span>Dark Theme</span>

        <select bind:value={$config.dark}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="original">Original</option>
        </select>
    </div>
{/if}

<!--    
    Background color

    Although all accent colors are supported, why would you use them?
-->
<div class={styles.optionRow}>
    <span>Background color</span>

    <select bind:value={$config.background}>
        {#each backgroundColors as [name, color]}
            <option value={color}>{name}</option>
        {/each}
    </select>
</div>

<!--
    Primary accent

    Used throughout the app for pretty much everything.
-->
<div class={styles.optionRow}>
    <span>Primary accent</span>

    <select bind:value={$config.primary}>
        {#each accentColors as [name, color]}
            <option value={color}>{name}</option>
        {/each}
    </select>
</div>

<!--
    Secondary accent

    Used for special lessons and that stuff...
-->
<div class={styles.optionRow}>
    <span>Secondary accent</span>

    <select bind:value={$config.secondary}>
        {#each accentColors as [name, color]}
            <option value={color}>{name}</option>
        {/each}
    </select>
</div>
