import { browser } from "$app/environment";

import styles from "$styles/modules/Ripple.module.scss";

export const rippleStyle = styles.ripple;

export function addRipple(element: HTMLElement) {
    if (!browser) return;

    element.ontouchstart = (event: TouchEvent) => {
        const { clientX, clientY } = event.targetTouches[0];

        if (document.elementsFromPoint(clientX, clientY).indexOf(element) === -1) return;

        element.classList.add(rippleStyle);
        element.classList.toggle(styles.active, true);

        const { x, y } = element.getBoundingClientRect();
        element.style.setProperty("--x", `${clientX - x}px`);
        element.style.setProperty("--y", `${clientY - y}px`);
    };

    element.ontouchend = () => {
        element.classList.toggle(styles.active, false);
    };
}
