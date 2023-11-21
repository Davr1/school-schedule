<script lang="ts">
    import { addRipple } from "$lib/ripple";

    import styles from "$styles/modules/Controls.module.scss";

    /**
     * An optional additional class name for the button
     */
    let className: string = "";
    export { className as class };
</script>

<button class={`${styles.button} ${className}`.trim()} on:click use:addRipple>
    <slot />
</button>
