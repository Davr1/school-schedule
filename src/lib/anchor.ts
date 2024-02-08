import { browser } from "$app/environment";

/**
 * Anchor an element to another element
 *
 * Sets the inset property of the element to the position of the anchor element
 *
 * Additionally these custom properties are set to the width and height of the anchor element
 * - `--anchor-width`
 * - `--anchor-height`
 *
 * And these ones are the remaining space between the anchor and the viewport
 * - `--anchor-max-width`
 * - `--anchor-max-height`
 *
 * Finally, a class with the chosen anchor position is added to the element
 * - `anchor-top`
 * - `anchor-left`
 * - `anchor-bottom`
 * - `anchor-right`
 *
 * @type {import('svelte/action').Action}
 */
export function anchor(element: HTMLElement, anchor: HTMLElement) {
    if (!browser) return;

    // First, attach an event listener to the window to update the position of the element when the window is resized
    window.addEventListener("resize", updatePosition);

    // Update the position of the element
    function updatePosition() {
        const pos = anchor.getBoundingClientRect();
        const w = window.innerWidth;
        const h = window.innerHeight;
        const wMid = w / 2;
        const hMid = h / 2;

        // Width and height
        element.style.setProperty("--anchor-width", pos.width + "px");
        element.style.setProperty("--anchor-height", pos.height + "px");

        // Horizontal position
        if (Math.abs(pos.left - wMid) < Math.abs(pos.right - wMid)) {
            element.style.right = w - pos.left + "px";
            element.style.left = "auto";
            element.style.setProperty("--anchor-max-width", pos.left + "px");
            element.classList.add("anchor-left");
        } else {
            element.style.left = pos.right + "px";
            element.style.right = "auto";
            element.style.setProperty("--anchor-max-width", w - pos.right + "px");
            element.classList.add("anchor-right");
        }

        // Vertical position
        if (Math.abs(pos.top - hMid) < Math.abs(pos.bottom - hMid)) {
            element.style.bottom = h - pos.top + "px";
            element.style.top = "auto";
            element.style.setProperty("--anchor-max-height", pos.top + "px");
            element.classList.add("anchor-top");
        } else {
            element.style.top = pos.bottom + "px";
            element.style.bottom = "auto";
            element.style.setProperty("--anchor-max-height", h - pos.bottom + "px");
            element.classList.add("anchor-bottom");
        }
    }

    // Update the position of the element
    updatePosition();

    return {
        destroy() {
            // Remove the event listener when the element is destroyed
            window.removeEventListener("resize", updatePosition);
        }
    };
}
