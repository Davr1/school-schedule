<script lang="ts">
    import Close from "@material-design-icons/svg/filled/close.svg?component";

    import type { Subject } from "$lib/subject";

    import Modal from "$components/Modal.svelte";
    import Content from "$components/SubjectInfo/Content.svelte";

    import controlStyles from "$styles/modules/Controls.module.scss";
    import Ripple, { addRipple } from "$components/Ripple.svelte";

    /** The subject to show the info for */
    export let subject: Subject;

    /** Whether the SubjectInfoModal is visible */
    export let visible: boolean;
</script>

<Modal bind:visible on:hideScreenOverlay>
    <Ripple>
        <Content {subject}>
            <button class={`${controlStyles.button} big`} on:click={() => (visible = false)} slot="close" use:addRipple>
                <Close />
            </button>
        </Content>
    </Ripple>
</Modal>
