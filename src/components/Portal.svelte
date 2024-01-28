<script lang="ts">
    import { browser } from "$app/environment";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    const dispatch = createEventDispatcher<{
        /** Called when the portal should be closed */
        close: null;
    }>();

    /** Portal element class */
    let className: string | undefined = undefined;
    export { className as class };

    /** A reference to the portal DOM node */
    let portal: HTMLDivElement;

    const inertElements: Element[] = [];

    // On mount, add the element to the body
    onMount(() => {
        document.body.appendChild(portal);

        // Disable scrolling on the body
        document.body.style.overflow = "hidden";

        // Disable tabbing on all elements except the portal
        for (const element of document.body.children) {
            if (element !== portal) {
                element.setAttribute("inert", "");
                inertElements.push(element);
            }
        }
    });

    // On destroy, remove the element from the body
    onDestroy(() => {
        // Don't do anything on the server
        if (!browser) return;

        portal.parentNode?.removeChild(portal);

        // Enable scrolling on the body
        document.body.style.overflow = "";

        // Enable tabbing on all elements
        for (const element of inertElements) {
            element.removeAttribute("inert");
        }
    });
</script>

<!--
@component
A basic portal that renders its children into a separate DOM node at the end of `document.body`.

On mount, it sets all other elements in the body to `inert` and disables scrolling on the body.
And on destroy, it removes the portal from the body and re-enables scrolling and tabbing on all elements.

Don't keep this mounted when not needed, as it will block the entire page!
-->

<svelte:window
    on:keydown={($event) => {
        // If escape is pressed, dispatch a close event
        if ($event.key === "Escape") dispatch("close");
    }}
/>

<div
    bind:this={portal}
    role="presentation"
    class={className}
    on:click|self={() => {
        // When the portal is clicked, dispatch a close event
        dispatch("close");
    }}
>
    <slot />
</div>
