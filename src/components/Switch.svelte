<script lang="ts">
    import styles from "$styles/modules/switch.module.scss";

    export let value: boolean;
</script>

<input class={styles.switch} type="checkbox" bind:checked={value} />
