import { browser } from "$app/environment";

/**
 * Attach this element to the body to render it outside of the current component
 *
 * @type {import('svelte/action').Action}
 */
export function portal(element: HTMLElement) {
    if (!browser) return;

    let focus: HTMLElement | null = null;

    document.body.appendChild(element);

    setTimeout(() => {
        // If the element has been unmounted like right after it was mounted, don't do anything
        if (!element) return;

        // Get the element that is currently focused
        focus = document.activeElement as HTMLElement;

        // Focus the element
        element.tabIndex = -1;
        element.focus();
    });

    return {
        destroy() {
            element.parentNode?.removeChild(element);

            // Refocus the element that was focused before the portal was opened
            setTimeout(() => focus?.focus());
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

    return {
        destroy() {
            // Make all siblings non-inert
            siblings.forEach((sibling) => sibling.removeAttribute("inert"));

            // Enable scrolling on the body
            document.body.style.overflow = "";
        }
    };
}
