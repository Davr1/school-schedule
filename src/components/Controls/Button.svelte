<script lang="ts">
    import styles from "$styles/modules/controls.module.scss";
</script>

<!--
    @component
    A generic button component, can be used for anything..
    
    It's literally just a <button> with styles applied.

    Events will be added as needed cuz svelte sucks at this...
-->

<button class={styles.button} on:click {...$$props}>
    <slot />
</button>
