<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export enum PaymentType {
        Free = 0,
        Monthly = 500,
        Yearly = 6000,
        Pirated = -1
    }

    export interface SubscriptionData {
        payment: PaymentType;
        visible: boolean;
        attempts: number;
    }

    export const subscription = writable<SubscriptionData>({
        payment: PaymentType.Pirated,
        visible: true,
        attempts: 0
    });

    if (browser) {
        const data = localStorage.getItem("subscription");
        if (data !== null) {
            subscription.set(JSON.parse(data));
            subscription.update((s) => ({ ...s, visible: false }));
        }

        subscription.subscribe((p) => {
            localStorage.setItem("subscription", JSON.stringify(p));
        });
    }

    export function close() {
        subscription.update((s) => ({ ...s, visible: false, attempts: 999 }));
    }
</script>

<script lang="ts">
    import { browser } from "$app/environment";
    import Payment from "$components/AprilFools/Payment.svelte";
    import Button from "$components/Controls/Button.svelte";
    import Modal from "$components/Modal.svelte";

    let paying = false;

    $: {
        if (!$subscription.visible) {
            $subscription.attempts += 1;

            if ($subscription.attempts < 5) setTimeout(() => ($subscription.visible = true), 150);
        }
    }
</script>

<Modal bind:visible={$subscription.visible}>
    <h1>Please activate your subscription{$subscription.attempts ? "!".repeat($subscription.attempts * 3) : "."}</h1>

    <p>
        We are proud to announce that <b>ŠŠŠVT rozvrh</b>
        is now a subscription&#8209;based service!🎉 🎉
    </p>

    <p>Choose a plan that suits you best:</p>

    <div style:display="flex" style:justify-content="center" style:gap="1rem" style:flex-wrap="wrap">
        <Button on:click={() => (($subscription.payment = 0), close())}>1 day free trial ⏱️</Button>
        <Button on:click={() => (($subscription.payment = 500), (paying = true))}>500 Kč / month 💵</Button>
        <Button on:click={() => (($subscription.payment = 6000), (paying = true))}>6000 Kč / year 💳</Button>
    </div>

    <p />
</Modal>

{#if $subscription.payment > 0 && $subscription.visible && paying}
    <Payment amount={$subscription.payment} bind:visible={paying} on:paid={close} />
{/if}
