<script lang="ts">
    import styles from "$styles/modules/Themes.module.scss";

    type T = $$Generic;

    /**
     * An array of all the possible options / values
     *
     *
     * Takes in a tuple of `[string, T]` where `string` is the label and `T` is the value.
     * Or optionally with a third value of `string` which will be used as the class name
     */
    export let options: readonly (readonly [string, T] | readonly [string, T, string])[] = [];

    /** The currently selected option, you should bind this to a store */
    export let selected: T;

    /**
     * The id of the select, this must be unique
     *
     * All the options will have an id of `${id}-${value}`
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

        <label class={styles.option}>
            <input class={`${styles.radio} ${className}`} class:small type="radio" name={id} bind:group={selected} {value} />

            <span>{label}</span>
        </label>
    {/each}
</div>
