import type { ActionReturn } from "svelte/action";

import { browser } from "$app/environment";

/**
 * Attach this element to the body to render it outside of the current component
 *
 * @param element The element to attach to the body
 * @param focus The element to focus after the portal is opened, defaults to the currently focused element
 */
export function portal(element: HTMLElement, focus?: HTMLElement | null): ActionReturn<HTMLElement | null | undefined> | void {
    if (!browser) return;

    document.body.appendChild(element);

    setTimeout(() => {
        // If the element has been unmounted like right after it was mounted, don't do anything
        if (!element) return;

        // Get the element that is currently focused (if it wasn't passed as an argument)
        focus ??= document.activeElement as HTMLElement;

        // Focus the element
        element.tabIndex = -1;
        element.focus();
    });

    const refocus = () => setTimeout(() => (focus?.focus(), (focus = null)));

    // If the element has a transition, listen for the outrostart event to refocus the element that was focused before the portal was opened
    element.addEventListener("outrostart", refocus);

    return {
        destroy() {
            element.parentNode?.removeChild(element);

            // Refocus the element that was focused before the portal was opened
            refocus();
        },

        update(param) {
            focus = param;
        }
    };
}

/**
 * Make all siblings of the element inert, except for the element itself
 *
 * @type {import('svelte/action').Action}
 */
export function inert(element: HTMLElement) {
    if (!browser) return;

    // Get all the siblings of the element
    const siblings = Array.from(element.parentElement?.children ?? []);

    // Make all siblings inert
    siblings.forEach((sibling) => {
        if (sibling !== element) sibling.setAttribute("inert", "");
    });

    // Disable scrolling on the body
    document.body.style.overflow = "hidden";

    function destroy() {
        // Make all siblings non-inert
        siblings.forEach((sibling) => sibling.removeAttribute("inert"));
        siblings.length = 0;

        // Enable scrolling on the body
        document.body.style.overflow = "";
    }

    // When the element has an outro, reset the inertness
    element.addEventListener("outrostart", destroy);

    return { destroy };
}
