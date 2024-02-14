<script lang="ts">
    import type { AnyDetail } from "@school-schedule/api/classes";

    import styles from "$styles/modules/Schedule/Link.module.scss";

    export let detail: AnyDetail | null;
</script>

{#if detail?.name}
    <a class={styles.link} href="./{detail.name}"><slot /></a>
{:else}
    <span class={styles.link}><slot /></span>
{/if}
