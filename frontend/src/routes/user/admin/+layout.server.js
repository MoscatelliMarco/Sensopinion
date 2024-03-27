import { error } from "@sveltejs/kit";

export async function load ({ locals }) {
    if (!locals.user?.admin) {
        throw new error(404, 'Not found')
    }
}