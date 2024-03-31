<script lang="ts">
    import styles from "$styles/modules/Controls/RoundSelect.module.scss";

    type T = $$Generic;

    /**
     * An array of all the possible options / values
     *
     *
     * Takes in a tuple of `[string, T]` where `string` is the label and `T` is the value.
     * Or optionally with a third value of `string` which will be used as the class name for the **label** (which wraps the radio button)
     */
    export let options: readonly (readonly [string, T] | readonly [string, T, string])[] = [];

    /** The currently selected option, you should bind this to a store */
    export let selection: T;

    /**
     * The id of the select, this must be unique
     *
     * Maps directly to the `id` attribute of the wrapper and the `name` attribute of the radio buttons
     */
    export let id: string;

    /**
     * Use smaller radio buttons
     */
    export let small = false;
</script>

<div {id} class={styles.select}>
    {#each options as option}
        {@const value = option[1]}
        {@const label = option[0]}
        {@const className = option[2] || value}

        <label class={`${styles.option} ${className}`} style:opacity={id != "theme" ? 0.5 : 1}>
            <input class={styles.radio} class:small type="radio" name={id} bind:group={selection} {value} disabled={id != "theme"} />

            <span>{label}</span>
        </label>
    {/each}
</div>
