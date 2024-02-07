<script lang="ts">
    import { page } from "$app/stores";

    import Options from "$components/Options.svelte";

    export let data;
</script>

<Options detail={$page.data.detail} week={data.week} />

<slot />
