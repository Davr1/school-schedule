<script lang="ts">
    export let value: boolean;
</script>

<label class="switch">
    <input type="checkbox" bind:checked={value} />
    <span class="slider" />
</label>
