<script lang="ts">
    import { page } from "$app/stores";

    import Options from "$components/Options.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    export let data;
</script>

<Options detail={$page.data.detail} week={data.week} />

<main class={styles.view}>
    <slot />
</main>
