<script lang="ts">
    import styles from "$styles/modules/Controls/Switch.module.scss";

    export let value: boolean;
</script>

<input class={styles.switch} type="checkbox" bind:checked={value} />
