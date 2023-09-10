<script context="module" lang="ts">
    import styles from "$styles/modules/Ripple.module.scss";
    import { browser } from "$app/environment";

    export const rippleStyle = styles.ripple;

    export function addRipple(element: HTMLElement) {
        if (!browser) return;
        element.classList.add(rippleStyle);

        element.ontouchstart = (event: TouchEvent) => {
            const { clientX, clientY } = event.targetTouches[0];

            if (document.elementsFromPoint(clientX, clientY).indexOf(element) === -1) return;

            element.classList.toggle(styles.active, true);

            const { x, y } = element.getBoundingClientRect();
            element.style.setProperty("--x", `${clientX - x}px`);
            element.style.setProperty("--y", `${clientY - y}px`);
        };

        element.ontouchend = () => {
            element.classList.toggle(styles.active, false);
        };
    }
</script>

<script lang="ts">
    import { beforeUpdate, afterUpdate, onMount, onDestroy } from "svelte";
    beforeUpdate(console.log);
    afterUpdate(console.log);
    onMount(console.log);
    onDestroy(console.log);
</script>

<slot />
