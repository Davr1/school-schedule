<script lang="ts">
    import type { Subject } from "$lib/subject";
    import type { getPosition } from "$lib/utilities";

    import DimOverlay from "$components/DimOverlay.svelte";
    import Content from "$components/SubjectInfo/Content.svelte";

    import styles from "$styles/modules/Schedule.module.scss";

    export let position: ReturnType<typeof getPosition>;
    export let subject: Subject;

    $: leftOffset = position.x < position.windowX ? "100%" : undefined;
    $: rightOffset = position.x > position.windowX ? "100%" : undefined;
    $: topOffset = position.y < position.windowY ? "0" : undefined;
    $: bottomOffset = position.y > position.windowY ? "0" : undefined;
    $: maxWidth =
        position.x < position.windowX
            ? `${position.windowWidth - position.size.x - position.size.width - 90}px`
            : `${position.size.x - 90}px`;
</script>

<div
    class={styles.info}
    style:left={leftOffset}
    style:right={rightOffset}
    style:top={topOffset}
    style:bottom={bottomOffset}
    style:max-width={maxWidth}
>
    <Content {subject} />
</div>

<DimOverlay dimmed on:close />
