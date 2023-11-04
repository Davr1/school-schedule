<script lang="ts">
    import { onMount } from "svelte";

    import Loading from "$assets/loading.svg?component";
    import UwU from "$assets/uwu.svg?component";

    import CacheButton from "$components/CacheButton.svelte";

    import styles from "$styles/modules/LoadScreen.module.scss";

    let show = false;

    onMount(() => {
        setTimeout(() => {
            show = true;
        }, 1000);
    });
</script>

<div class={styles.overlay}>
    <Loading height="3rem" />
    <UwU height="3rem" />

    {#if show}
        <CacheButton class={styles.button} />
    {/if}
</div>
