import type { ParamMatcher } from "@sveltejs/kit";

/** Icon type matcher */
export const match: ParamMatcher = (param) => {
    return ["svg", "png"].includes(param);
};
