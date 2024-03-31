<script>
    import { PaymentType, subscription } from "$components/AprilFools/Subscription.svelte";
</script>

<button
    style:appearance="none"
    style:width="calc(100% - 2rem)"
    style:background="var(--dimmed-background)"
    style:font-size="1.25rem"
    style:text-align="center"
    style:margin-inline="1rem"
    style:border-radius="0.25rem"
    style:padding-block="0.25rem"
    style:border="none"
    style:color="var(--accent-primary)"
    on:click={() => {
        $subscription.visible = true;
        $subscription.attempts = 4;
    }}
>
    {#if $subscription.payment === PaymentType.Pirated}
        <div class="rose" style:color="var(--primary-500)">Pirated version ⚠️⚠️ 🏴‍☠️🏴‍☠️🏴‍☠️</div>
    {:else}
        <div>
            1

            {#if $subscription.payment === PaymentType.Free}
                day
            {:else if $subscription.payment === PaymentType.Monthly}
                month
            {:else if $subscription.payment === PaymentType.Yearly}
                year
            {/if}

            remaining until your subscription expires.
        </div>
    {/if}
</button>
