<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "$components/Icon/Icon.svelte";
    import Modal from "$components/Modal.svelte";
    import ThemeEditor from "$components/ThemeEditor.svelte";

    import styles from "$styles/modules/Gone.module.scss";

    let visible = false;
</script>

<div class={styles.page}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span on:click={() => (visible = !visible)} class={styles.icon}>
        <Icon size="6rem" padding={2} rounding={3} on:click />
    </span>

    <h1 class={styles.title}>
        <span class="status">{$page.status}</span>
        {$page.error?.message}
    </h1>

    <!-- Gone page message -->
    {#if $page.status === 410}
        <p class={styles.gone}>
            <span class={styles.url}>rozvrh.icy.cx</span>
            již nefunguje z důvodu zrušení volného modulu rozvrhu na straně SSŠVT.
        </p>
    {/if}

    <Modal bind:visible scrollable>
        <h1>Color settings</h1>

        <!-- This is here to reset the primary / secondary selection on every open -->
        {#key visible}
            <ThemeEditor />
        {/key}
    </Modal>
</div>
