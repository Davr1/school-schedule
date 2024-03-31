<script lang="ts">
    import Button from "$components/Controls/Button.svelte";
    import Modal from "$components/Modal.svelte";
    import { createEventDispatcher } from "svelte";

    export let amount: number;
    export let visible = true;

    const dispatch = createEventDispatcher<{ paid: void }>();
</script>

<Modal bind:visible>
    <h1>Payment</h1>

    <p>
        Please hand deliver the amount of <strong>{amount} Kč</strong>
        to
        <i>Ing. Martin Vodička.</i>
    </p>

    <p>If you have already paid, please click the button below.</p>

    <div style:display="flex" style:justify-content="center">
        <Button on:click={() => ((visible = false), dispatch("paid"))}>I have paid ✅💰</Button>
    </div>
</Modal>
