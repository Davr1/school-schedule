import colors from "tailwindcss/colors";

import type { Colors } from "$components/Icon/Icon.svelte";

export function getIconColors(background: string, accent: string): Colors | undefined {
    const bg = colors[background as keyof typeof colors];
    const acc = colors[accent as keyof typeof colors];

    // Make sure the colors are valid
    if ((!bg && background !== "original") || (!acc && accent !== "original")) {
        return;
    }

    return {
        BG: bg?.[800] ?? "#2c3138",
        FG: bg?.[600] ?? "#4c555e",
        Accent: acc?.[500] ?? "#1f6feb"
    };
}

// I don't want to write this 2 times so I'm doing this...
export class InvalidColorResponse extends Response {
    constructor() {
        super("Invalid colors", {
            status: 400,
            headers: { "Content-Type": "text/plain" }
        });
    }
}
