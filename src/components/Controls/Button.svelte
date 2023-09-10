<script lang="ts">
    import Ripple, { addRipple, rippleStyle } from "$components/Ripple.svelte";

    import styles from "$styles/modules/Controls.module.scss";
</script>

<!--
    @component
    A generic button component, can be used for anything..
    
    It's literally just a <button> with styles applied.

    Events will be added as needed cuz svelte sucks at this...
-->

<Ripple>
    <button class={`${styles.button} ${rippleStyle}`} on:click {...$$props} use:addRipple>
        <slot />
    </button>
</Ripple>
