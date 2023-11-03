<script lang="ts">
    import { updateScheduleParams } from "$stores/config";
    import { cache } from "$stores/main";

    import Loading from "$assets/loading.svg?component";
    import UwU from "$assets/uwu.svg?component";
    import History from "@material-design-icons/svg/filled/history.svg?component";

    import controlStyles from "$styles/modules/Controls.module.scss";
    import styles from "$styles/modules/LoadScreen.module.scss";
    import { onMount } from "svelte";

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
        <button class={`${controlStyles.button} ${styles.button}`} on:click={() => (($cache = true), updateScheduleParams())}>
            <History />

            Load schedule from cache
        </button>
    {/if}
</div>
