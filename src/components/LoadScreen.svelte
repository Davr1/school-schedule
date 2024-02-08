<script lang="ts">
    import { onMount } from "svelte";

    import Loading from "$assets/loading.svg?component";

    import CacheButton from "$components/CacheButton.svelte";
    import Favicon from "$components/Icon/Favicon.svelte";

    import styles from "$styles/modules/LoadScreen.module.scss";

    // whether the cache button is visible
    let show = false;

    onMount(() => {
        setTimeout(() => {
            show = true;
        }, 1000);
    });
</script>

<div class={styles.loading}>
    <Favicon loading />
    <Loading height="4rem" />

    {#if show}
        <CacheButton class={styles.button} />
    {/if}
</div>
