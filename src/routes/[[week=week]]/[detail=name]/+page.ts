import { DetailHandler } from "@school-schedule/api/classes";
import { error } from "@sveltejs/kit";

export async function load({ params: { detail }, parent }) {
    // Get the week
    const { week } = await parent();

    // Find the detail
    const item = DetailHandler.instance.getByName(detail);
    if (item)
        return {
            detail: item,
            week
        };

    // If the detail is not found, show an error, but it's not really possible to get here sooo
    error(404, "Schedule not found");
}
