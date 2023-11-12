import type { ParamMatcher } from "@sveltejs/kit";

/** Number matcher */
export const match: ParamMatcher = (param) => {
    return !Number.isNaN(Number(param));
};
